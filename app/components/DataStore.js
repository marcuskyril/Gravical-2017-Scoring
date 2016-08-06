var axios = require('axios');

    class DataStore {
      constructor(data){ // pass res.data here

        console.log("data length", Object.keys(data).length);
        this.size = Object.keys(data).length || 2000;
        this._cache = data; // set cache with res.data here
      }

      getObjectAt(/*number*/ index) /*?object*/ {
        if (index < 0 || index > this.size){
          return undefined;
        }
        return this._cache[index];
      }

      /**
      * Populates the entire cache with data.
      * Use with Caution! Behaves slowly for large sizes
      * ex. 100,000 rows
      */
      getAll() {
        if (this._cache.length < this.size) {
          for (var i = 0; i < this.size; i++) {
            this.getObjectAt(i);
          }
        }
        return this._cache.slice();
      }

      getSize() {
        return this.size;
      }
    }


module.exports = DataStore;
