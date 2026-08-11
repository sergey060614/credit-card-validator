// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  // Точка входа: главный JS-файл приложения
  entry: './src/index.js',
  
  // Куда складывать готовую сборку
  output: {
    filename: 'bundle.[contenthash].js', // Имя файла с хешем для сброса кеша браузера
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/', // Путь для ассетов внутри HTML
    assetModuleFilename: 'assets/[name][ext]' // Сохранять картинки в папку assets/
  },

  mode: 'development', // Режим разработки (подставьте 'production' для финальной сборки)
  devtool: 'inline-source-map', // Для удобного отладки кода в браузере

  module: {
    rules: [
      // Правило для JavaScript (Babel)
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/, // Не обрабатываем сторонние библиотеки
        use: ['babel-loader']
      },
      
      // Правило для CSS
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader, // Выносит CSS в отдельный файл
          'css-loader',                // Позволяет импортировать CSS в JS
          'postcss-loader'             // Добавляет автопрефиксы (-webkit-, -moz-)
        ]
      },

      // Правило для картинок и шрифтов
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)$/i,
        type: 'asset/resource', // Webpack скопирует файл в dist и вернет путь к нему
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx'], // Можно писать import X from './file' вместо './file.js'
  },

  plugins: [
    // Очищает папку dist перед каждой новой сборкой
    new CleanWebpackPlugin(),
    
    // Генерирует index.html и автоматически вставляет туда ссылки на bundle.css и bundle.js
    new HtmlWebpackPlugin({
      template: './src/index.html', // Берет ваш шаблон
    }),

    // Выносит собранный CSS в отдельный файл styles.css
    new MiniCssExtractPlugin({
      filename: 'styles.[contenthash].css'
    })
  ],

  devServer: {
    static: path.join(__dirname, 'dist'), // Папка, которую раздает сервер
    port: 9000,                           // Порт localhost:9000
    open: true,                           // Автоматически открывает браузер
    hot: true,                            // Hot Module Replacement (обновление без перезагрузки страницы)
    historyApiFallback: true              // Нужно для SPA (Single Page Applications)
  }
};