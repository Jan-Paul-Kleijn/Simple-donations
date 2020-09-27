<?
/* MOLLIE_API_KEY
* Want to use Mollie? Insert your Mollie API key here.
* Currently an API key is formatted by Mollie as 'test_dHar4XY7LxsDOtmnkVtjNVWXLSlXsM'
*/
define('_MOLLIE_API_KEY','test_DU6gnbPy45HaEwfcvu2xQEt3Bgkjub');
define('_HOST', 'bladibla');

require_once "Mollie/API/Autoloader.php";

$mollie = new Mollie_API_Client;
$mollie->setApiKey(_MOLLIE_API_KEY);
?>
