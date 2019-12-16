This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### Formulas Used

Profit/Loss =  (today’s price of 1BTC * X bitcoins you bought) - (price you bought 1BTC at * X bitcoins you bought)
Interest Rate = (currency_price*.10)+currency_price

### Descriptions and Functionalities

This app fetches cryptocurrency details of over 100 coins from [coingecko API docs]. On the top part of the app is the dynamic changing description of the first rank or the highest amount of 1 coin to USD. The user can click buttons that represents fluctuation of the prices depends on the duration that starts from 1 Day up to 1 Year. On its right side is the overview of the details of the highest cryptocurrency which also coded dynamically, and the user can view the full descptions by clicking the bottom button. On the left pane is the Investment Options of the user namely, `Buy`, `Sell`, `Transaction History`, `Track Investment` and the `User's Wallet`. First, I set the default amount of the User's wallet to `$1,000,000` for start up amount. This will be dynamically change after such transactions like `Buy` or `Sell`. If the User buys a certain coin, the User shoul select first what coin to buy and how much quantity. At the bottom part of the `Buy` modal is the the latest `currency_price` of the selected coin, next is the `total_value` which is computed by multiplying the `currency_price` by 0.10 and its product will be added again to `currency_price` to get its `Interest Rate`. The sum will then be multiplied depends on the user's input of the quantity of the coin. After the `Buy` button is clicked, the details will be Posted (`.post`) to [http://localhost:4000/transactions] and the page will reload to view the latest details. If the user wants to `Sell` the coin, the user will select first what coin to sell. After the user selected the coin, below the text area is the `On Hand Coin Amount` which represents the latest quantity of the selected coin. **Note: The amount should not be less than 1 or more than the `On Hand Coin Amount` or else the details will not be posted to the endpoint**. The user can also view the `Transaction History`. The table shows the type or transaction, date or transaction, name of the coin, it's current price, remaining coins invested or the on hand coin qty, total coin invested, total transaction which is computed using `Interest Rate Formula`, and the account money or the latest user's wallet. To view the `Profit` or `Loss` of the user before selling a certain amount of coin, the user will select first what coin and click the buttons wich represents the duration of its changes that depends on 1 Hour duration, 1 Day or 1 Week. Means that for 1hr, the user will gain or lost this amount of money, and so on. A postive amount of money indicates `Profit` or gain of money and a negative amount of money represents a `Loss`.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify