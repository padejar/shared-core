import joi from "joi";

export const notesSchema = joi.object({
  supportingNotes: joi.string().allow(null, "").optional(),
  hasApplicantConsent: joi.boolean().valid(true).required().messages({
    "boolean.base":
      "You must make the declaration above and indicate your acceptance by ticking the checkbox",
    "any.only":
      "You must make the declaration above and indicate your acceptance by ticking the checkbox",
  }),
});
