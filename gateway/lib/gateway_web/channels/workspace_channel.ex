defmodule GatewayWeb.WorkspaceChannel do
  use Phoenix.Channel, hibernate_after: :infinity
  alias GatewayWeb.WorkspacePresence

  def join("workspace:lobby", %{"token" => token}, socket) do
    dbg(token)
    # {:error, %{reason: "unauthorized"}}
    send(self(), :after_join)
    socket = assign(socket, :token, token)
    {:ok, %{message: "hello"}, socket}
  end

  def join("workspace:" <> topic, params, socket) do
    {:ok, socket}
  end

  def handle_in("event_name", params, socket) do
    push(socket, "from_server", %{success: true, data: "from server data"})
    # {:reply, {:error, %{success: false, error: "error from event_name reply"}}, socket}
    # {:noreply, socket}
    {:reply, {:ok, %{success: true, data: "from event name reply"}}, socket}
  end

  def terminate(reason, socket) do
    dbg("[terminate] reason=#{inspect(reason)}")
    :ok
  end

  def handle_info(:after_join, socket) do
    {:ok, _} =
      WorkspacePresence.track(socket, socket.assigns.token, %{
        token: socket.assigns.token,
        online_at: inspect(System.system_time(:second))
      })

    push(socket, "presence_state", WorkspacePresence.list(socket))
    {:noreply, socket}
  end
end
