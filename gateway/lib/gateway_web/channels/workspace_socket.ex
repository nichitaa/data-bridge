defmodule GatewayWeb.WorkspaceSocket do
  use Phoenix.Socket
  alias GatewayWeb.Services

  channel "workspace:*", GatewayWeb.WorkspaceChannel
  channel "query:*", GatewayWeb.QueryChannel

  def connect(%{"jwt" => jwt}, socket, connect_info) do
    socket = assign(socket, :jwt, jwt)

    %{"success" => true, "data" => user_data} =
      socket.assigns.jwt
      |> Services.Auth.client()
      |> Services.Auth.get_self()

    dbg("new connection - user_data: #{inspect(user_data)}")

    socket = assign(socket, :user_id, user_data["userId"])
    socket = assign(socket, :user_name, user_data["userName"])

    {:ok, socket}
  end

  def id(socket), do: socket.assigns.user_id
end
