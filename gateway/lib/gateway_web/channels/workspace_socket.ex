defmodule GatewayWeb.WorkspaceSocket do
  use Phoenix.Socket

  channel "workspace:*", GatewayWeb.WorkspaceChannel

  def connect(params, socket, connect_info) do
    {:ok, socket}
  end

  def id(socket) do
    nil
  end
end
