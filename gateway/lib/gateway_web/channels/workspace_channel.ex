defmodule GatewayWeb.WorkspaceChannel do
  use Phoenix.Channel, hibernate_after: :infinity
  alias GatewayWeb.WorkspacePresence

  def join("workspace:" <> workspace_id, params, socket) do
    user_id = socket.assigns.user_id
    dbg("[wp] join user: #{user_id}, workspace_id: #{workspace_id}")
    # TODO: check if this user could join this workspace
    socket = assign(socket, :workspace_id, workspace_id)
    send(self(), :after_join)
    {:ok, %{success: true}, socket}
  end

  def handle_in("event_name", params, socket) do
    # push(socket, "from_server", %{success: true, data: "from server data"})
    # broadcast!(socket, "broadcast_topic", %{payload: "was broadcasted"})
    # {:reply, {:error, %{success: false, error: "error from event_name reply"}}, socket}
    # {:noreply, socket}
    {:reply, {:ok, %{success: true, data: "from event_name reply"}}, socket}
  end

  def handle_info(:after_join, socket) do
    dbg(
      "[wp] after_join track presence for user_id: #{socket.assigns.user_id} and workspace_id: #{socket.assigns.workspace_id}"
    )

    {:ok, _} =
      WorkspacePresence.track(socket, socket.assigns.user_id, %{
        user_id: socket.assigns.user_id,
        user_name: socket.assigns.user_name,
        workspace_id: socket.assigns.workspace_id,
        online_at: inspect(System.system_time(:second))
      })

    push(socket, "presence_state", WorkspacePresence.list(socket))
    {:noreply, socket}
  end

  def terminate(reason, socket) do
    dbg("[wp]-[terminate] reason=#{inspect(reason)}")
    :ok
  end
end
