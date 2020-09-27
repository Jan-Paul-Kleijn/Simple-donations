<?
session_start();
try {
	 require_once 'init.php';
	 require_once 'helpers.php';


/*
 * Determine the donation amount
 */

  $selectedAmount = filter_input(INPUT_POST, 'donationAmountSelect', FILTER_VALIDATE_INT);
  if( ! $selectedAmount ) { // donation amount is not a selected number (int), check for custom amount
    if( $_POST['donationAmountSelect'] === "x" ) {
      $number = filter_input(INPUT_POST, 'donationAmountCustom', FILTER_VALIDATE_FLOAT);
      if( ! $number ) { // donation amount from manual input is also not a (correct) number (float)
        echo "Not a (correct) number.";
        exit;
      } else {
        $amount = $number;
      }
    } else { // No donation amount selected, nor custom donation amount selected/set
      echo "No donation amount selected or set.";
      exit;
    }
  } else {
    $amount = $selectedAmount;
  }


/*
 * Check email address
 */

  $email = filter_var($_POST["email"], FILTER_VALIDATE_EMAIL);


/*
 * Create v4 UUID for payment
 */

  $uid = guidv4(openssl_random_pseudo_bytes(16));


/*
 * Build payment object
 */
  $payment = $mollie->payments->create(
    array(
      'amount'      => $amount,
      'description' => 'Bedankt voor je donatie',
      'redirectUrl' => _HOST.'/bedankt-voor-je-donatie',
      'webhookUrl'  => _HOST.'/core/donation_confirmation.php',
      'metadata'    => array(
        'donation_uid' => $uid,
        'donor_email' => $email
      )
    )
  );


/*
 * Send the customer off to complete the payment.
 */
  header("Location: " . $payment->getPaymentUrl());
  exit;
}


/*
 * Exception messages on error.
 */

catch (Mollie_API_Exception $e) {
  echo "API call failed: " . htmlspecialchars($e->getMessage());
  echo " on field " . htmlspecialchars($e->getField());
}
?>
