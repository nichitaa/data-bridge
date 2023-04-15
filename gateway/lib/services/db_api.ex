defmodule GatewayWeb.Services.DbApi do
  def test_connection(client, payload) do
    Tesla.post(client, "/api/Connector/VerifyDbConnection", payload) |> get_response_body()
  end

  def run_query(client, payload) do
    Tesla.post(client, "/api/Connector/ExecuteQuery", payload) |> get_response_body()
  end

  def format_query(client, payload) do
    Tesla.post(client, "/api/Connector/FormatSqlQuery", payload) |> get_response_body()
  end

  def export_to_csv(client, payload) do
    Tesla.post(client, "/api/Connector/ExportQueryToCsv", payload) |> get_response_body()
  end

  def db_scheme(client, payload) do
    Tesla.post(client, "/api/Connector/DbScheme", payload) |> get_response_body()
  end

  def client(token) do
    middleware = [
      Tesla.Middleware.Logger,
      Tesla.Middleware.KeepRequest,
      {Tesla.Middleware.JSON,
       decode_content_types: ["application/problem+json", "application/json"]},
      {Tesla.Middleware.BaseUrl, Application.fetch_env!(:gateway, :db_api_service_base_url)},
      {Tesla.Middleware.BearerAuth, token: token},
      {Tesla.Middleware.Timeout, timeout: 4_000},
      {Tesla.Middleware.Retry, delay: 50, max_delay: 2000, max_retries: 3},
      {Tesla.Middleware.Headers, [{"content-type", "application/json"}]}
    ]

    Tesla.client(middleware)
  end

  ## Privates

  defp get_response_body({:ok, %Tesla.Env{body: response_body}}), do: response_body
end
