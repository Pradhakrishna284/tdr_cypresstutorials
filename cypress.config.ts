import { defineConfig } from "cypress";

export default defineConfig({
  viewportWidth: 1980,
  viewportHeight: 1080,

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here

      //https://www.youtube.com/watch?v=Csjg1qktnU0 @6:50
      let value

      on('task', {
        log(message) {
          console.log(message)
          return null
        }, 

        save(v) {
          value = v
          return null
        }, 
        
        load() {
          return value || null
        }
      });

    },


  },
});
