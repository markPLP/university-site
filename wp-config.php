<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'local' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', 'root' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

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
define( 'AUTH_KEY',          'weqL{nIvpl)(k_k}#?r903r2St2gVoF,]3={Hpt0FsP(b+1UObJGf)c9B~BIZC$w' );
define( 'SECURE_AUTH_KEY',   'P,BH_%bNZf7GF#jbFi;E8,oGvzT`6E%pCnlErQc:6E*9K#aH]P-?]y76`cA7>~^y' );
define( 'LOGGED_IN_KEY',     'g=vpE^4g8&OnlT6*jSc?<YT3r4*e~H8jc5/]sS=1TyFOxCW8QDDQW#X3UHE 7)|Q' );
define( 'NONCE_KEY',         'A_7(*fZ M?<B@ID/u`; 4!HR&L#(1}Fj~*n ]!FLO^ux-A|tScGq]jc?d8g~rtKu' );
define( 'AUTH_SALT',         'q-xHe%2WfLOE;wYEvU^]rT>{Hnbp9a9(kRcm>|tj0k%gJ2KC*Yd%F8TO6ZuqET?c' );
define( 'SECURE_AUTH_SALT',  '/-b%Yx@0C[>%1`*(OJ.Cm-E]ThnrU`&<K+RQ>4pH)7#C87E.@uWE5o|t7z5F`Z`P' );
define( 'LOGGED_IN_SALT',    'Uy&3x{_9GY}`gMRqQllRVP8v AmZ8g!S@}Ar&=o2pl*FmtR<S=LUCQ]_nmy?`e4k' );
define( 'NONCE_SALT',        'NJzEiqGje{CH9{UINRIHdYrOu5OxATP+|7:?e8[Fd2//]W)0$mZO]<`pO`IySMEX' );
define( 'WP_CACHE_KEY_SALT', '/nDPKk}}he8Ts>0=5?|FhYtFR*=Gp)r/~S*KcWj`Bro6H9Z>QsoQiit]Vgw-LvsT' );


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';


/* Add any custom values between this line and the "stop editing" line. */



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
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

define( 'WP_ENVIRONMENT_TYPE', 'local' );
/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
