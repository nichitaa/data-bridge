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

  ## Collaborator API

  def handle_in("add_collaborator", params, socket) do
    wp_id = workspace_id(socket)
    email = params["email"]

    response =
      main_api_client_with_jwt(socket)
      |> MainApi.add_collaborator(wp_id, email)

    send(self(), :workspace_info)
    {:reply, {:ok, response}, socket}
  end

  def handle_in("delete_collaborator", params, socket) do
    wp_id = workspace_id(socket)
    email = params["email"]

    response =
      main_api_client_with_jwt(socket)
      |> MainApi.delete_collaborator(wp_id, email)

    send(self(), :workspace_info)
    {:reply, {:ok, response}, socket}
  end

  def handle_in("update_collaborator_role", params, socket) do
    wp_id = workspace_id(socket)
    email = params["email"]
    payload = %{role: params["role"]}

    response =
      main_api_client_with_jwt(socket)
      |> MainApi.update_collaborator_role(wp_id, email, payload)

    send(self(), :workspace_info)
    {:reply, {:ok, response}, socket}
  end

  ## Resource API

  def handle_in("create_resource", params, socket) do
    wp_id = workspace_id(socket)

    response =
      main_api_client_with_jwt(socket)
      |> MainApi.create_resource(wp_id, params)

    send(self(), :workspace_info)
    {:reply, {:ok, response}, socket}
  end

  def handle_in("rename_resource", params, socket) do
    wp_id = workspace_id(socket)

    response =
      main_api_client_with_jwt(socket)
      |> MainApi.rename_resource(wp_id, params)

    send(self(), :workspace_info)
    {:reply, {:ok, response}, socket}
  end

  def handle_in("delete_resource", params, socket) do
    wp_id = workspace_id(socket)

    response =
      main_api_client_with_jwt(socket)
      |> MainApi.delete_resource(wp_id, params)

    send(self(), :workspace_info)
    {:reply, {:ok, response}, socket}
  end

  ## Query API

  def handle_in("update_query", params, socket) do
    wp_id = workspace_id(socket)
    query_id = params["queryId"]

    response =
      main_api_client_with_jwt(socket)
      |> MainApi.update_query(wp_id, query_id, params)

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

  ## Side effects

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

  ## Utils

  defp main_api_client_with_jwt(socket) do
    socket.assigns.jwt
    |> MainApi.client()
  end

  defp workspace_id(socket), do: socket.assigns.workspace_id
end
