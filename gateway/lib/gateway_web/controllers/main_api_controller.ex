defmodule GatewayWeb.MainApiController do
  use GatewayWeb, :controller
  alias GatewayWeb.Services.MainApi

  # when action in [:list_workspaces]
  plug GatewayWeb.Plugs.RequireJwt

  ## Workspace API
  def list_workspaces(conn, _params) do
    response =
      conn.assigns.jwt
      |> MainApi.client()
      |> MainApi.list_workspaces()

    json(conn, response)
  end

  def get_workspace_by_id(conn, %{"workspace_id" => id}) do
    response =
      conn.assigns.jwt
      |> MainApi.client()
      |> MainApi.get_workspace_by_id(id)

    json(conn, response)
  end

  def create_workspace(conn, params) do
    body = conn.body_params

    response =
      conn.assigns.jwt
      |> MainApi.client()
      |> MainApi.create_workspace(body)

    json(conn, response)
  end

  def delete_workspace_by_id(conn, %{"workspace_id" => id}) do
    response =
      conn.assigns.jwt
      |> MainApi.client()
      |> MainApi.delete_workspace_by_id(id)

    json(conn, response)
  end

  def update_workspace_by_id(conn, %{"workspace_id" => id} = params) do
    body = conn.body_params

    response =
      conn.assigns.jwt
      |> MainApi.client()
      |> MainApi.update_workspace_by_id(id, body)

    json(conn, response)
  end

  ## Collaborator API

  def add_collaborator(conn, %{"workspace_id" => wp_id, "email" => email}) do
    response =
      conn.assigns.jwt
      |> MainApi.client()
      |> MainApi.add_collaborator(wp_id, email)

    json(conn, response)
  end

  def delete_collaborator(conn, %{"workspace_id" => wp_id, "email" => email}) do
    response =
      conn.assigns.jwt
      |> MainApi.client()
      |> MainApi.delete_collaborator(wp_id, email)

    json(conn, response)
  end

  def update_collaborator_role(conn, %{"workspace_id" => wp_id, "email" => email}) do
    body = conn.body_params

    response =
      conn.assigns.jwt
      |> MainApi.client()
      |> MainApi.update_collaborator_role(wp_id, email, body)

    json(conn, response)
  end

  ## Resource API

  def create_resource(conn, %{"workspace_id" => wp_id}) do
    body = conn.body_params

    response =
      conn.assigns.jwt
      |> MainApi.client()
      |> MainApi.create_resource(wp_id, body)

    json(conn, response)
  end

  def rename_resource(conn, %{"workspace_id" => wp_id}) do
    body = conn.body_params

    response =
      conn.assigns.jwt
      |> MainApi.client()
      |> MainApi.rename_resource(wp_id, body)

    json(conn, response)
  end

  def delete_resource(conn, %{"workspace_id" => wp_id}) do
    body = conn.body_params

    response =
      conn.assigns.jwt
      |> MainApi.client()
      |> MainApi.delete_resource(wp_id, body)

    json(conn, response)
  end

  ## Query API

  def update_query(conn, %{"workspace_id" => id, "query_id" => query_id} = params) do
    body = conn.body_params

    response =
      conn.assigns.jwt
      |> MainApi.client()
      |> MainApi.update_query(id, query_id, body)

    json(conn, response)
  end
end
