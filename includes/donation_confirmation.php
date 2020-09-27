<?
try {
	 include_once "init.php";

  $payment = $mollie->payments->get($_POST["id"]);

  if ($payment->isPaid()) {
      /*
       * At this point you'd probably want to send a confirmation of payment to the
       * customer and start the process of delivering the product to the customer.
       */
    $amount = $payment->amount;
    $donation_id = $payment->metadata->donation_id;
    $donor_email = $payment->metadata->donor_email;
    
//send emails to donor and yourself
    include_once "../php/mail.php";
    $head_me = array(
      'to' => array(s('website_email')=>s('website_title')),
      'from' => array($donor_email=>'')
    );
    $head_ct = array(
      'to' => array($donor_email=>''),
      'from' => array(s('website_email')=>s('website_title'))
    );
    $subject_me = "Een websitebezoeker heeft een vraag";
    $subject_ct = s('contact_subject');
    $body_me  = "<div style=\"width:100%;height:100%;background-color:#fafafa;margin:0px;padding:0px;font-family:Arial;font-size:1em\">";
    $body_me .= "  <div style=\"position:relative;max-width:800px;width:98%;padding:0px 1% 30px 1%;margin:0px;background-color:#ffffff\">";
    $body_me .= "    ".$donation_id;
    $body_me .= "  </div>";
    $body_me .= "</div>";
    $body_ct  = "<div style=\"width:100%;height:100%;background-color:#fafafa;margin:0px;padding:0px;font-family:Arial;font-size:1em\">";
    $body_ct .= "  <div style=\"position:relative;max-width:800px;width:98%;padding:0px 1% 30px 1%;margin:0px;background-color:#ffffff\">";
    $body_ct .= "    ".$donation_id;
    $body_ct .= "  </div>";
    $body_ct .= "</div>";
    email::send($head_me,$subject_me,$body_me);
    email::send($head_ct,$subject_ct,$body_ct);
  }
  elseif (! $payment->isOpen()) {
      /*
       * The payment isn't paid and isn't open anymore. We can
       * assume it was aborted.
       */
    header("Location: " . _HOST."/payment-aborted");
  }
} catch (Mollie_API_Exception $e) {
	echo "API call failed: " . htmlspecialchars($e->getMessage());
}

?>
