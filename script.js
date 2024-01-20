// script.js

(function ($) {
    // Define the jQuery plugin named 'infiniteScrollContacts'
    $.fn.infiniteScrollContacts = function (options) {
  
      // Default options for the plugin
      const defaults = {
        totalContacts: 50,
        contactid: 1
      };
  
      // Merge user-provided options with defaults
      options = $.extend({}, defaults, options);
  
      // Function to create a contact element
      function createContact(id) {
        let index = Math.floor(Math.random() * 10);
        var contact = $("<div>").addClass("contact").attr("id", id);
        var image = $("<img>").attr("src","images/"+ index + ".png");
        var text = $("<p>").text(`Person-${id}`);
        contact.append(image, text);
        return contact;
      }
  
      // Main logic of the plugin
      return this.each(function () {
        var contacts = $(this);
        var id = options.contactid;
        var total = options.totalContacts;
        contacts.addClass("contacts");
  
        // Function to populate the initial contacts
        function defaultData() {
          for (let i = 0; i < 20; i++) {
            var contact = createContact(id);
            id++;
            contacts.append(contact);
          }
        }
  
        // Populate initial data when the plugin is initialized
        defaultData();
  
        let contactHeight = contacts.find("div:first-child").height();
        var position = contacts.height() / 2;
        var lowerLimit = position + contactHeight;
        var upperLimit = position - contactHeight;
  
        // Function to add a new contact to the top
        function addTop() {
          var contact = createContact(parseInt(contacts.find("div:first-child").attr("id")) - 1);
          contact.insertBefore(contacts.find("div:first-child"));
        }
  
        // Function to remove the last contact
        function removeLast() {
          let lastContact = contacts.find("div:last-child");
          if (lastContact.length) {
            lastContact.remove();
          }
        }
  
        // Function to add a new contact to the bottom
        function addLast() {
          var contact = createContact(parseInt(contacts.find("div:last-child").attr("id")) + 1);
          contacts.append(contact);
        }
  
        // Function to remove the first contact
        function removeFirst() {
          let firstContact = contacts.find("div:first-child");
          if (firstContact.length) {
            firstContact.remove();
          }
        }
  
        let isFirst = true;
        let isLower = false;
        let isUpper = false;
        let scrollPosition = contacts.scrollTop();
  
        // Event listener for scroll
        contacts.on("scroll", function () {
  
          var distance = contacts.scrollTop();
          const scrollDirection = distance > scrollPosition ? "down" : "up";
  
          if (scrollDirection === "down") {
            // Logic for scrolling down
            if (distance >= contactHeight && !isLower && isFirst) {
              isFirst = false;
              var count = Math.floor(distance / contactHeight);
  
              for (let i = count; i > 0; i--) {
                let a = contacts.find("div:last-child");
                if (parseInt(a.attr("id")) < total) {
                  isLower = true;
                  addLast();
                  removeFirst();
                  contacts.scrollTop(position);
                  isLower = false;
                }
              }
            } else if (distance >= lowerLimit && !isLower && !isFirst) {
              // Logic for scrolling down after reaching the lower limit
              var tempDistance = distance - position;
              var count = Math.floor(tempDistance / contactHeight);
              for (let i = count; i > 0; i--) {
                let a = contacts.find("div:last-child");
                if (parseInt(a.attr("id")) < total) {
                  isLower = true;
                  addLast();
                  removeFirst();
                  contacts.scrollTop(position);
                  isLower = false;
                }
              }
            }
          } else if (scrollDirection === "up") {
            // Logic for scrolling up
            if (distance <= upperLimit && !isUpper && !isFirst) {
              var tempDistance = position - distance;
              var count = Math.floor(tempDistance / contactHeight);
              for (let i = count; i > 0; i--) {
                let a = contacts.find("div:first-child");
                if (parseInt(a.attr("id")) > options.contactid) {
                  isUpper = true;
                  addTop();
                  removeLast();
                  contacts.scrollTop(position);
                  isUpper = false;
                }
              }
            }
          }
          scrollPosition = distance;
        });
      });
    };
  })(jQuery);
  