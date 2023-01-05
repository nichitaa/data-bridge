defmodule GatewayWeb.DbApiController do
  use GatewayWeb, :controller
  alias GatewayWeb.Services.DbApi

  plug GatewayWeb.Plugs.RequireJwt

  def test_connection(conn, params) do
    body = conn.body_params

    response =
      conn.assigns.jwt
      |> DbApi.client()
      |> DbApi.test_connection(body)

    json(conn, response)
  end
end
