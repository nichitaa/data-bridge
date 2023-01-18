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

  def export_to_csv(conn, params) do
    body = conn.body_params

    response =
      conn.assigns.jwt
      |> DbApi.client()
      |> DbApi.export_to_csv(body)

    case response do
      %{"success" => false, "error" => error} ->
        conn
        |> put_status(:bad_request)
        |> json(response)

      csv ->
        send_download(conn, {:binary, csv}, filename: "query.csv", disposition: :attachment)
    end
  end
end
