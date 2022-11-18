defmodule GatewayWeb.MainApiController do
  use GatewayWeb, :controller
  alias GatewayWeb.Services.MainApi

  plug GatewayWeb.Plugs.RequireJwt # when action in [:list_workspaces]

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

  def add_collaborator(conn, %{"workspace_id" => wp_id, "collaborator_id" => collaborator_id}) do
    response =
      conn.assigns.jwt
      |> MainApi.client()
      |> MainApi.add_collaborator(wp_id, collaborator_id)

    json(conn, response)
  end

end