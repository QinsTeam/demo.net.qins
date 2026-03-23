import "reflect-metadata";

import { Gateway, HTTPServiceFramework, ActorNode, AttributeNode, ActionNode, OperateType, TypeNode, ParameterNode, LoggerLevel } from "@qinsteam/net-core";
import { Pack } from "./pack";
import { deserializePack, serializePack } from "./serialize";

Gateway.config.net.framework = {
  service: { type: HTTPServiceFramework.Empty },
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
        },
      },
      response: {
        actor: {
          name: [OperateType.Local],
          email: [OperateType.Local],
          password: [OperateType.Local],
        },
      },
    },
    result: {
      type: TypeNode(void 0),
    },
  })
  async getUser(): Promise<void> {
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
    console.log(pack);
    throw new Error("Method not implemented.");
  }
}

void User;

export async function main() {
  void Gateway.start();
  const user = new User();
  user.id = "123";
  user.password = "1234";
  try {
    await user.getUser();
    console.log(JSON.stringify(user));
    const pack = new Pack();
    pack.id = "aaaa";
    await user.addPackage(pack);
    console.log(JSON.stringify(user));
  } catch (error) {
    console.error("Error:", error);
  }
}
main();