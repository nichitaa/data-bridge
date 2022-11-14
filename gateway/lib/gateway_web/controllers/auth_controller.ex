defmodule GatewayWeb.AuthController do
  use GatewayWeb, :controller
  alias GatewayWeb.Services.Auth

  plug GatewayWeb.Plugs.RequireJwt when action in [:get_self]

  def register(conn, _params) do
    body = conn.body_params

    response =
      Auth.client("")
      |> Auth.register(body)

    json(conn, response)
  end

  def login(conn, _params) do
    body = conn.body_params

    response =
      Auth.client("")
      |> Auth.login(body)

    json(conn, response)
  end

  def get_self(conn, _params) do
    response =
      conn.assigns.jwt
      |> Auth.client()
      |> Auth.get_self()

    json(conn, response)
  end
end
