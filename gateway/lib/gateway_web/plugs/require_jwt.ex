defmodule GatewayWeb.Plugs.RequireJwt do
  import Plug.Conn

  def init(_params) do
  end

  def call(conn, _params) do
    headers = conn.req_headers
    jwt = get_bearer_token(conn)

    case jwt do
      nil -> halt_unauthorized_response(conn, "missing Bearer token")
      token -> assign(conn, :jwt, token)
    end
  end

  ## Privates

  def halt_unauthorized_response(conn, error_message) do
    conn
    |> Plug.Conn.put_resp_content_type("application/json")
    |> send_resp(:unauthorized, Jason.encode!(%{error: error_message, success: false}))
    |> halt()
  end

  defp get_bearer_token(conn) do
    authorization = get_req_header(conn, "authorization")

    case authorization do
      ["Bearer " <> token] -> token
      [] -> nil
    end
  end
end
