import "reflect-metadata";

import { Gateway, HTTPServiceFramework, ActorNode, AttributeNode, ActionNode, OperateType, VoidType, TypeNode, ParameterNode } from "@qinsteam/net-core";
import { Pack } from "./pack";
import { deserializePack, serializePack } from "./serialize";

Gateway.config.net.framework = {
  service: { type: HTTPServiceFramework.Express },
};
Gateway.config.net.endpoint = "http://localhost:8080";
@ActorNode()
class User {
  @AttributeNode({ name: "id" })
  id: string = "";
  @AttributeNode({ name: "name" })
  name: string = "";
  @AttributeNode({ name: "email", type: TypeNode(String) })
  email: string = "";
  @AttributeNode({ name: "password" })
  password: string = "";
  @AttributeNode({ name: "packages", type: { type: [],name: "Pack[]",serialize: serializePack, deserialize: deserializePack } })
  packages: Pack[] = [];

  @ActionNode({
    pact: {
      request: {
        actor: {
          id: [OperateType.Local],
          password: [OperateType.Local],
        }
      },
      response: {
        actor: {
          name: [OperateType.Local],
          email: [OperateType.Local],
          password: [OperateType.Local],
        }
      }
    },
    result: {
      type: VoidType(),
    },
  })
  async getUser(): Promise<void> {
    if (this.id == "123" && this.password == "1234") {
      this.name = "Ether";
      this.email = "Ether@example.com";
      this.password = "";
    }
    return Promise.resolve();
  }

  @ActionNode({
    pact: {
      request: {
        actor: {},
        parameters: {
          pack: {
            id: [OperateType.Local],
          },
        },
      },
      response: {
        actor: {
          packages: [OperateType.Local],
        },
        result: {
          name: [OperateType.Local],
          version: [OperateType.Local],
        },
      },
    },
    result: {
      type: TypeNode(Pack),
    },
  })
  async addPackage(@ParameterNode({ name: "pack" }) pack: Pack): Promise<Pack> {
    if (pack.id == "aaaa") {
      this.packages.push(pack);
      pack.id = "bbbb";
      pack.version = "1.0.0";
      pack.name = "test";
      pack.description = "test package";
    }
    return Promise.resolve(pack);
  }
}

Gateway.on("register", (_net, origin) => {
  console.log(`Net registered: ${origin}`);
});

Gateway.on("unregister", (_net, origin) => {
  console.log(`Net unregistered: ${origin}`);
});

Gateway.on("empty", () => {
  console.log("All nets stopped.");
});

async function main() {
  console.log("Server started.",User.name);
  await Gateway.start();
}

main().catch(console.error);
