import { ClientDesignVariable } from "./models";

/**
 * @summary Updates the value for the clientDesignVariable with this designVariableId. If a clientDesignVariable doesn't exist yet it will create one.
 * @param clientId id of the client
 * @param designVariableId id of the designVariable (not clientDesignVariable).
 * @param value value to assign to the clientDesignVariable.
 * @returns id of the updated/inserted record.
 */
export const updateOneDesignVariable = async (
  clientId: number,
  designVariableId: number,
  value: string
) => {
  // Get clientDesignVariables
  const clientDesignVariable = await ClientDesignVariable.findOne({
    where: {
      designVariableId: designVariableId,
      clientId: clientId,
    },
  });

  if (clientDesignVariable) {
    // Update existing
    await ClientDesignVariable.update(
      {
        value: value,
      },
      {
        where: {
          id: clientDesignVariable.id,
        },
      }
    );
  } else {
    // Create new
    const { id } = await ClientDesignVariable.create({
      designVariableId: designVariableId,
      clientId: clientId,
      value: value,
    });
  }
  // Always returning the designVariableId and not the clientVariableId because the CMS is unaware of the clientVariableId. It's using DesignVariableModel, and the id field of that maps to the designVariableId.
  return designVariableId;
};
