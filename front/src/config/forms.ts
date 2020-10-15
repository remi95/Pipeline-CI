import { FormStep } from '../models/FormModel';

/**
 * Foreach form, set a FormStep with a step label and a string collection, using field keys.
 */
export const FORM_STEPS: Record<string, FormStep[]> = {
  FAVOR: [
    {
      label: 'Que souhaitez-vous proposer ?',
      fieldsKeys: ['title', 'category', 'cities'],
    },
    {
      label: 'Décrivez votre service !',
      fieldsKeys: ['content'],
    },
    {
      label: 'Quand et pour combien de personnes est disponible votre service ?',
      fieldsKeys: ['dateStart', 'dateEnd', 'placeLimit'],
    },
    {
      label: 'Une photo pour illustrer ce service ?',
      fieldsKeys: ['pictures[]'],
    },
  ],
  REQUEST: [
    {
      label: 'Que souhaitez-vous demander ?',
      fieldsKeys: ['title', 'category', 'cities'],
    },
    {
      label: 'Spécifiez votre demande !',
      fieldsKeys: ['content'],
    },
    {
      label: 'Quand souhaiteriez vous que ce service vous soit rendu ?',
      fieldsKeys: ['dateStart', 'dateEnd'],
    },
    {
      label: 'Une photo pour illustrer cette demande (optionnel) ?',
      fieldsKeys: ['pictures[]'],
    },
  ],
};
