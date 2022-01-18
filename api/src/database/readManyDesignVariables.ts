import { DesignVariableModel } from "api-shared";
import { ClientDesignVariable, DesignVariable } from "./models";

/**
 * @summary Gets the DesignVariableModels for the clientId passed in.
 * @param id clientId
 */
export const readManyDesignVariables = async (clientId: number) => {
  // Get clientDesignVariables
  const clientDesignVariables = await ClientDesignVariable.findAll({
    where: {
      clientId: clientId,
    },
  });

  // Get designVariables and map
  const designVariables = await DesignVariable.findAll();
  const designVariableModels: DesignVariableModel[] = designVariables.map(
    (designVariable) => {
      const clientDesignVariable = clientDesignVariables.find(
        (m) => m.designVariableId === designVariable.id
      );
      return {
        id: designVariable.id,
        name: designVariable.name,
        orderIndex: designVariable.order,
        type: designVariable.type,
        description: designVariable.description,
        defaultValue: designVariable.defaultValue,
        value: clientDesignVariable?.value,
      };
    }
  );

  return designVariableModels;

  // // Get customStyle and map
  // const clientCustomStyle = await ClientCustomStyle.findOne({
  //   where: {
  //     clientId: id,
  //   },
  // });
  // const customStyleModel: ClientCustomCssModel = {
  //   id: clientCustomStyle?.id,
  //   customCss: clientCustomStyle?.customCss,
  //   version: clientCustomStyle?.version,
  // };
};
