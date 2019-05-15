
## Installation Notes:

We need install node, yarn. 

Node: https://nodejs.org/en/download/package-manager/#macos , Version:  > 8.x 

Yarn: https://yarnpkg.com/en/docs/install#mac-stable , latest. 

```
yarn         #install packege
yarn dev     #start server
```
and you can link it. http://127.0.0.1:3333

adonisjs is optional for database migration.

The mail function needs to be modified by .env
MAIL_ADDRESS and MAIL_PASSWD, and the Gmail privacy settings.

-------------------------------------------------------------------------------------------------------
Our target headset has the following features:

- Enough number of occurrences: greater than 15 times (StatService.apperMore)

- Remove Extreme Value                                                  (StatHelpers.filterOutliers)

- The slope of the regression line should be stable          (StatService.getStatisticData)

If the trend is normal, we can include the earphone to target.

In index page, there are data within three days.

- When the target earphone price is below a standard deviation, we think it can be bought.

- When the target earphone price is higher than the average, we think it can be sold.
