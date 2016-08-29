var webpack = require('webpack');
var path = require('path');
var envFile = require('node-env-file');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

try {
  envFile(path.join(__dirname, 'config/' + process.env.NODE_ENV + '.env'));
} catch (e) {

}

module.exports = {
  entry: [
    'script!jquery/dist/jquery.min.js',
    'script!foundation-sites/dist/foundation.min.js',
    'script!foundation-sites/js/foundation.dropdownMenu.js',
    './app/app.jsx'
  ],
  externals: {
    jquery: 'jQuery'
  },
  plugins: [
    new webpack.ProvidePlugin({
      '$': 'jquery',
      'jQuery': 'jquery'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        API_KEY: JSON.stringify(process.env.API_KEY),
        AUTH_DOMAIN: JSON.stringify(process.env.AUTH_DOMAIN),
        DATABASE_URL: JSON.stringify(process.env.DATABASE_URL),
        STORAGE_BUCKET: JSON.stringify(process.env.STORAGE_BUCKET)
      }
    })
  ],
  output: {
    path: __dirname,
    filename: './public/bundle.js'
  },
  resolve: {
    root: __dirname,

    alias: {
      Abnormal: 'app/components/Abnormal.jsx',
      AccountSettings: 'app/components/AccountSettings.jsx',
      AddSensor: 'app/components/AddSensor.jsx',
      app: 'app',
      Building: 'app/components/Building.jsx',
      BuildingOverview: 'app/components/BuildingOverview.jsx',
      Dashboard: 'app/components/Dashboard.jsx',
      DeleteSensor: 'app/components/DeleteSensor.jsx',
      EditSensor: 'app/components/EditSensor.jsx',
      WatchList: 'app/components/WatchList.jsx',
      Login: 'app/components/Login.jsx',
      Main: 'app/components/Main.jsx',
      Nav: 'app/components/Nav.jsx',
      Notifications: 'app/components/Notifications.jsx',
      NotificationLog: 'app/components/NotificationLog.jsx',
      PageNotFound: 'app/components/PageNotFound.jsx',
      SensorDetails: 'app/components/SensorDetails.jsx',
      SensorHealthOverviewV2: 'app/components/SensorHealthOverviewV2.jsx',
      Tableaux: 'app/components/Tableaux.jsx',
      Uptime: 'app/components/Uptime.jsx',

      addSensorAPI: 'app/api/addSensorAPI.jsx',
      editSensorAPI: 'app/api/editSensorAPI.jsx',
      deleteSensorAPI: 'app/api/deleteSensorAPI.jsx',
      notificationLogAPI: 'app/api/notificationLogAPI.jsx',
      removeFromWatchlist: 'app/api/removeFromWatchlistAPI.jsx',
      retrieveSensorDetails: 'app/api/retrieveSensorDetails.jsx',

      applicationStyles: 'app/styles/app.scss',
      griddleStyles: 'app/styles/griddle.scss',
      loginStyles: 'app/styles/login.scss',
      navStyles: 'app/styles/nav.scss',

      actions: 'app/actions/actions.jsx',
      configureStore: 'app/store/configureStore.jsx',
      reducers: 'app/reducers/reducers.jsx'

    },
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0']
        },
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/
      }
    ]
  }
};
