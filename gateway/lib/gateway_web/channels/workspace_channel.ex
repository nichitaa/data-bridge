defmodule GatewayWeb.WorkspaceChannel do
  use Phoenix.Channel, hibernate_after: :infinity

  def join("workspace:lobby", _message, socket) do
    dbg(_message)
    # {:error, %{reason: "unauthorized"}}
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
end
