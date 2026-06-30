import { config, collection, fields } from '@keystatic/core';
// import { config, singleton, fields } from '@keystatic/core';


export default config({
  storage: {
    kind: 'local',
  },

  collections: {
    people: collection({
      label: 'People',
      path: 'content/people/*',
      slugField: 'id',
      // slugField: 'name',
      schema: {
        // fileName: fields.slug({
        //   name: {
        //     label: 'Имя файла'
        //   },
        // }),
        id: fields.text({
          label: 'ID',
        }),
        name: fields.text({
          label: 'Name',
          validation: {
            isRequired: true,
          },
        }),
        // name: fields.slug({
        //   name: {
        //     label: 'Name',
        //   },
        // }),
        birthDate: fields.text({
          label: 'Birth date',
        }),
      },
    }),
  },
});