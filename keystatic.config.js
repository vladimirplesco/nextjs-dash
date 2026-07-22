import { config, collection, fields } from '@keystatic/core';
// import { config, singleton, fields } from '@keystatic/core';


export default config({
  storage: {
    // for local
    kind: 'local',
    // for Github
    // kind: 'github',
    // repo: {
    //   owner: 'vladimirplesco',
    //   name: 'nextjs-dash',
    // },
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
    users: collection({
      label: 'Users',
      path: 'content/users/*',
      slugField: 'username',

      schema: {
        username: fields.slug({
          name: {
            label: 'Username',
          },
        }),

        name: fields.text({
          label: 'Name',
          validation: {
            isRequired: true,
          },
        }),

        // passwordHash: fields.text({
        //   label: 'Password hash',
        //   validation: {
        //     isRequired: true,
        //   },
        // }),

        role: fields.select({
          label: 'Role',
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Editor', value: 'editor' },
            { label: 'Viewer', value: 'viewer' },
          ],
          defaultValue: 'viewer',
        }),

        active: fields.checkbox({
          label: 'Active',
          defaultValue: true,
        }),
      },
    }),
  },
});