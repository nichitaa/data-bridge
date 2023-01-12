defmodule GatewayWeb.Services.MainApi do

  ## Workspace API

  def list_workspaces(client) do
    Tesla.get(client, "/api/workspaces") |> get_response_body()
  end

  def get_workspace_by_id(client, id) do
    Tesla.get(client, "/api/workspace/" <> id) |> get_response_body()
  end

  def create_workspace(client, payload) do
    Tesla.post(client, "/api/workspace", payload) |> get_response_body()
  end

  def delete_workspace_by_id(client, id) do
    Tesla.delete(client, "/api/workspace/" <> id) |> get_response_body()
  end

  def update_workspace_by_id(client, id, payload) do
    Tesla.patch(client, "/api/workspace/" <> id, payload) |> get_response_body()
  end

  ## Collaborator API

  def add_collaborator(client, wp_id, email) do
    Tesla.post(client, "/api/workspace/" <> wp_id <> "/collaborator/" <> email, %{})
    |> get_response_body()
  end

  def delete_collaborator(client, wp_id, email) do
    Tesla.delete(client, "/api/workspace/" <> wp_id <> "/collaborator/" <> email)
    |> get_response_body()
  end

  def update_collaborator_role(client, wp_id, email, payload) do
    Tesla.post(client, "/api/workspace/" <> wp_id <> "/collaborator/" <> email <> "/update-role", payload)
    |> get_response_body()
  end

  ## Resource API

  def create_resource(client, wp_id, payload) do
    Tesla.post(client, "/api/workspace/" <> wp_id <> "/create-resource", payload)
    |> get_response_body()
  end

  def rename_resource(client, wp_id, payload) do
    Tesla.post(client, "/api/workspace/" <> wp_id <> "/rename-resource", payload)
    |> get_response_body()
  end

  # TODO: wait for fix
  def delete_resource(client, wp_id, payload) do
    Tesla.post(client, "/api/workspace/" <> wp_id <> "/delete-resource", payload)
    |> get_response_body()
  end

  ## Query API

  def update_query(client, wp_id, query_id, payload) do
    Tesla.patch(client, "/api/workspace/" <> wp_id <> "/query/" <> query_id, payload)
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
