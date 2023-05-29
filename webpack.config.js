const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    // Add other configuration options as needed
    module: {
        rules: [
            // ...other rules

            // Rule for handling images
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192, // Adjust the limit based on your needs
                            name: 'images/[name].[ext]', // Output path and filename
                            esModule: false,
                        },
                    },
                ],
            },
        ],
    },
};
