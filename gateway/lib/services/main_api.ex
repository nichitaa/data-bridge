defmodule GatewayWeb.Services.MainApi do
  def list_workspaces(client) do
    Tesla.get(client, "/api/Workspace") |> get_response_body()
  end

  def get_workspace_by_id(client, id) do
    Tesla.get(client, "/api/Workspace/" <> id) |> get_response_body()
  end

  def create_workspace(client, payload) do
    Tesla.post(client, "/api/Workspace", payload) |> get_response_body()
  end

  def delete_workspace_by_id(client, id) do
    Tesla.delete(client, "/api/Workspace/" <> id) |> get_response_body()
  end

  def update_workspace_by_id(client, id, payload) do
    Tesla.patch(client, "/api/Workspace/" <> id, payload) |> get_response_body()
  end

  def add_collaborator(client, wp_id, collaborator_id) do
    Tesla.post(client, "/api/Workspace/" <> wp_id <> "/User/" <> collaborator_id, %{})
    |> get_response_body()
  end

  def create_collection(client, wp_id, payload) do
    Tesla.post(client, "/api/Workspace/" <> wp_id <> "/Collection", payload)
    |> get_response_body()
  end

  def create_folder(client, wp_id, col_id, payload) do
    Tesla.post(
      client,
      "/api/Workspace/" <> wp_id <> "/Collection/" <> col_id <> "/Folder",
      payload
    )
    |> get_response_body()
  end

  def create_query(client, wp_id, col_id, fol_id, payload) do
    Tesla.post(
      client,
      "/api/Workspace/" <> wp_id <> "/Collection/" <> col_id <> "/Folder/" <> fol_id <> "/Query",
      payload
    )
    |> get_response_body()
  end

  def update_query(client, wp_id, col_id, fol_id, q_id, payload) do
    Tesla.patch(
      client,
      "/api/Workspace/" <>
        wp_id <> "/Collection/" <> col_id <> "/Folder/" <> fol_id <> "/Query/" <> q_id,
      payload
    )
    |> get_response_body()
  end

  def client(token) do
    middleware = [
      Tesla.Middleware.Logger,
      Tesla.Middleware.KeepRequest,
      {Tesla.Middleware.JSON,
       decode_content_types: ["application/problem+json", "application/json"]},
      {Tesla.Middleware.BaseUrl, Application.fetch_env!(:gateway, :main_api_service_base_url)},
      {Tesla.Middleware.BearerAuth, token: token},
      {Tesla.Middleware.Timeout, timeout: 2_000},
      {Tesla.Middleware.Retry, delay: 50, max_delay: 2000, max_retries: 3},
      {Tesla.Middleware.Headers, [{"content-type", "application/json"}]}
    ]

    Tesla.client(middleware)
  end

  ## Privates

  defp get_response_body({:ok, %Tesla.Env{body: response_body}}), do: response_body
end
