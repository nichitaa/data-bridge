defmodule GatewayWeb.WorkspaceChannel do
  use Phoenix.Channel, hibernate_after: :infinity
  alias GatewayWeb.WorkspacePresence
  alias GatewayWeb.Services.MainApi
  alias GatewayWeb.Services.DbApi

  def join("workspace:" <> workspace_id, params, socket) do
    user_id = socket.assigns.user_id
    dbg("[wp] join user: #{user_id}, workspace_id: #{workspace_id}")
    # TODO: check if this user could join this workspace
    socket = assign(socket, :workspace_id, workspace_id)
    send(self(), :after_join)
    send(self(), :workspace_info)
    {:ok, %{success: true}, socket}
  end

  def handle_in("event_name", params, socket) do
    # push(socket, "from_server", %{success: true, data: "from server data"})
    # broadcast!(socket, "broadcast_topic", %{payload: "was broadcasted"})
    # {:reply, {:error, %{success: false, error: "error from event_name reply"}}, socket}
    # {:noreply, socket}
    {:reply, {:ok, %{success: true, data: "from event_name reply"}}, socket}
  end

  def handle_in("create_collection", params, socket) do
    wp_id = socket.assigns.workspace_id

    response =
      socket.assigns.jwt
      |> MainApi.client()
      |> MainApi.create_collection(wp_id, params)

    send(self(), :workspace_info)

    {:reply, {:ok, response}, socket}
  end

  def handle_in("create_folder", params, socket) do
    wp_id = socket.assigns.workspace_id
    col_id = params["collection_id"]

    response =
      socket.assigns.jwt
      |> MainApi.client()
      |> MainApi.create_folder(wp_id, col_id, params)

    send(self(), :workspace_info)

    {:reply, {:ok, response}, socket}
  end

  def handle_in("create_query", params, socket) do
    wp_id = socket.assigns.workspace_id
    col_id = params["collection_id"]
    fol_id = params["folder_id"]

    response =
      socket.assigns.jwt
      |> MainApi.client()
      |> MainApi.create_query(wp_id, col_id, fol_id, params)

    send(self(), :workspace_info)

    {:reply, {:ok, response}, socket}
  end

  def handle_in("run_query", params, socket) do
    response =
      socket.assigns.jwt
      |> DbApi.client()
      |> DbApi.run_query(params)

    {:reply, {:ok, response}, socket}
  end

  def handle_in("format_query", params, socket) do
    response =
      socket.assigns.jwt
      |> DbApi.client()
      |> DbApi.format_query(params)

    {:reply, {:ok, response}, socket}
  end

  def handle_in("save_query_raw_sql", params, socket) do
    wp_id = socket.assigns.workspace_id
    col_id = params["collection_id"]
    fol_id = params["folder_id"]
    q_id = params["query_id"]

    response =
      socket.assigns.jwt
      |> MainApi.client()
      |> MainApi.update_query(wp_id, col_id, fol_id, q_id, params)

    send(self(), :workspace_info)

    {:reply, {:ok, response}, socket}
  end

  def handle_info(:workspace_info, socket) do
    dbg("[wp] workspace_info")
    id = socket.assigns.workspace_id

    response =
      socket.assigns.jwt
      |> MainApi.client()
      |> MainApi.get_workspace_by_id(id)

    push(socket, "workspace_info", response)

    {:noreply, socket}
  end

  # Presence update after join
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
