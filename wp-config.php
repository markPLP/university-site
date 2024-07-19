<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'university' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', '' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         '3es8%eAp#I%LVf{Q8.HDBs-8a/^MI{C4A)HQ<&N7prF AiV-oO%dWMzcTV`lke`5' );
define( 'SECURE_AUTH_KEY',  '_e`PB,MJ*+Z2RM3$ZNoI;n4L`(b lYeM3ig#?k!^A!b|dzB!}pkRi9xn)8gHzUD|' );
define( 'LOGGED_IN_KEY',    'YW%P$.Mg>kqqlwEm6@GPd9[_)W[VL?-[rDsuS]H4}ES/k[TtB@%v&n$ZS8&m@Z=d' );
define( 'NONCE_KEY',        '><n.fmT3(2sION{ @a!<8y=loMIB2aaK%*y+nNoc,Or*)dS5LDS:8/5CkC2P|r(V' );
define( 'AUTH_SALT',        'FquQKcrtqo>[)wnVI9Jk!Tb4Zf``*idi|#l+fP D$[OMmXu#n&Oc1G>i6x22Wr]T' );
define( 'SECURE_AUTH_SALT', 'MQA1/9;XPo@>K`&P5SpRxe@qLM-Bp@>$NYa`Y[JESG@~.q&n}]A)@]y6t] h,W/[' );
define( 'LOGGED_IN_SALT',   'S`Ng<jb,g4xcy,.2!!h1amN-cmZM7<-wEy,c[Y_;Mk!XobkCMy}W6d i)u1[^ub1' );
define( 'NONCE_SALT',       'H=@#&r_7Zh@v)JzDF}]O[N<s#~9l9|h@5<sB5;)OmP]}-MT8jh3lhdEySKI6>}O.' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://developer.wordpress.org/advanced-administration/debug/debug-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
