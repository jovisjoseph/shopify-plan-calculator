corner.on("onCartEdit", (params) => {
  $(".corner-cowi-cart-item-list-item-info-remove-btn svg").replaceWith(`
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
    <path d="M2.77686 5.32578H4.28647M4.28647 5.32578H16.3634M4.28647 5.32578V15.8931C4.28647 16.2934 4.44552 16.6774 4.72862 16.9605C5.01173 17.2436 5.39571 17.4027 5.79608 17.4027H13.3441C13.7445 17.4027 14.1285 17.2436 14.4116 16.9605C14.6947 16.6774 14.8538 16.2934 14.8538 15.8931V5.32578M6.55089 5.32578V3.81616C6.55089 3.41579 6.70994 3.03181 6.99304 2.7487C7.27615 2.4656 7.66013 2.30655 8.0605 2.30655H11.0797C11.4801 2.30655 11.8641 2.4656 12.1472 2.7487C12.4303 3.03181 12.5893 3.41579 12.5893 3.81616V5.32578M8.0605 9.09981V13.6286M11.0797 9.09981V13.6286" stroke="#959A9C" stroke-width="1.50961" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`);
});
$(".corner-cowi-cart-possible-free-product").click(function () {
  location.href = "/gift-purchase";
  console.log("Gift Clicked");
});

// $('.corner-cowi-cart-possible-free-product').find('span').val("Get a Free Gift");

corner.on("onCowiOpen", (params) => {
  if ($(".complete-thelook-slider").length) {
    $(".complete-thelook-slider").show();
  }

  $("#corner-cowi-cart-summary-items-wrapper span").each(function () {
    setTimeout(function () {
      const text = $(this).text();
      if (text.includes("AUD")) {
        $(this).text(text.replace("AUD", "").trim());
      }

      $(
        "#corner-cowi-cart-summary-discount .text-cowi-secondary-type"
      ).replaceWith("Save x");

      $("#corner-cowi-cart-summary-discount .text-cowi-primary-type").each(
        function () {
          var $this = $(this); // Store reference to `$(this)`
          var textContent = $this.text().trim();

          // Prevent multiple '$' additions
          if (!textContent.startsWith("$")) {
            textContent = textContent.replace("AUD", "").trim();
            $this.text("$" + textContent);
          }
        }
      );
    }, 3000);
  });

  $(".corner-cowi-cart-item-list-item-info-remove-btn svg").replaceWith(`
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
    <path d="M2.77686 5.32578H4.28647M4.28647 5.32578H16.3634M4.28647 5.32578V15.8931C4.28647 16.2934 4.44552 16.6774 4.72862 16.9605C5.01173 17.2436 5.39571 17.4027 5.79608 17.4027H13.3441C13.7445 17.4027 14.1285 17.2436 14.4116 16.9605C14.6947 16.6774 14.8538 16.2934 14.8538 15.8931V5.32578M6.55089 5.32578V3.81616C6.55089 3.41579 6.70994 3.03181 6.99304 2.7487C7.27615 2.4656 7.66013 2.30655 8.0605 2.30655H11.0797C11.4801 2.30655 11.8641 2.4656 12.1472 2.7487C12.4303 3.03181 12.5893 3.41579 12.5893 3.81616V5.32578M8.0605 9.09981V13.6286M11.0797 9.09981V13.6286" stroke="#959A9C" stroke-width="1.50961" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`);

  if (
    $("#corner-cowi-cart-summary-card-cta-button div").find("svg").length === 0
  ) {
    $("#corner-cowi-cart-summary-card-cta-button div").prepend(`
  <svg style='margin-right:10px;margin-top:1px;height:20px!important;width:20px!important;' xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" style="margin-right: 8px;">
    <path d="M17 11H7V7a5 5 0 0110 0v4zM5 11h14v10H5V11z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`);
  }

  setTimeout(function () {
    // Insert the event capture snippet from your analytics app here
    var $span = $("#corner-cowi-cart-goal-meter-text span");

    // Get the text of the span element
    var spanText = $span.text();
    // Check if the text contains "AUD"
    if (spanText.includes("AUD")) {
      // Replace "AUD" with "$" in the text
      var newText = spanText.replace("AUD", "");

      // Set the new text back to the span element
      $span.text(newText);
    }

    var $span1 = $("#corner-cowi-cart-summary-discount-negative-sign");

    // Get the text of the span element
    var spanText1 = $span1.text();
    // Check if the text contains "AUD"
    if (spanText1.includes("AUD")) {
      // Replace "AUD" with "$" in the text
      var newText1 = spanText1.replace("AUD", "");

      // Set the new text back to the span element
      $span1.text("$" + newText1);
    }

    $(".text-xs.md\\:text-sm").each(function () {
      var $this = $(this);

      // Check if 'Was' has already been added to this element
      if (!$this.hasClass("was-added")) {
        // Prepend 'Was ' before the entire paragraph
        $this.prepend("Was ");

        // Mark the paragraph as 'was-added' to prevent adding 'Was' again
        $this.addClass("was-added");
      }

      $this.removeClass("line-through");

      // Find the span inside the paragraph
      var $span = $this.find("span");

      if ($span.length) {
        // Get the current text of the span
        var spanText = $span.text().trim();

        // Prevent multiple '$' additions
        if (!spanText.startsWith("$")) {
          spanText = spanText.replace("AUD", "").trim();
          $span.text("$" + spanText);
        } else if (spanText.startsWith("-")) {
          spanText = spanText.replace("AUD", "").trim();
          $span.text(spanText);
        }

        // Add 'line-through' only to the span
        $span.addClass("line-through");
      }
    });

    $(".text-sm.md\\:text-base").each(function () {
      var spanD = $(this).find("span");

      if (spanD.length) {
        var text = spanD.text().trim();

        // Remove 'AUD' and trim spaces
        text = text.replace(/\s*AUD\s*/g, "").trim();

        // Ensure the '$' sign is not already present
        if (!text.startsWith("$")) {
          spanD.text("$" + text);
        }
      }
    });

    $("#corner-cowi-cart-summary-discount .text-cowi-primary-type").each(
      function () {
        var $this = $(this); // Store reference to `$(this)`
        var textContent = $this.text().trim();

        // Remove "AUD" and extra spaces
        textContent = textContent.replace(/\s*AUD\s*/g, "").trim();

        // Ensure the '$' is after the '-'
        if (!textContent.includes("$")) {
          if (textContent.startsWith("-")) {
            textContent = "- $" + textContent.substring(1).trim();
          } else {
            textContent = "$" + textContent;
          }
          $this.text(textContent);
        }

        // Delay to check again after updates
        setTimeout(function () {
          var updatedText = $this.text().trim();
          if (!updatedText.includes("$")) {
            if (updatedText.startsWith("-")) {
              updatedText = "- $" + updatedText.substring(1).trim();
            } else {
              updatedText = "$" + updatedText;
            }
            $this.text(updatedText);
          }
        }, 1000);
      }
    );

    $("#corner-cowi-cart-summary-card-cta-button-price").each(function () {
      // Find the span inside the paragraph
      var spanC = $(this).find("span");

      if (spanC.length) {
        // Get the current text of the span
        var text = spanC.text().trim();

        // Prevent multiple '$' additions
        if (!text.startsWith("$")) {
          text = text.replace("AUD", "").trim();
          spanC.text("$" + text);
        }
      }
    });
  }, 1000);
});

corner.on("onCowiClose", (params) => {
  if ($(".complete-thelook-slider").length) {
    $(".complete-thelook-slider").hide();
  }
});
