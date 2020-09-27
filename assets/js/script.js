var donate = {
  getElementsByTagAndClassName:function(tagname,classname){
    var elements = document.getElementsByTagName(tagname),
        elementsN = elements.length,
        selection = [];
    for(var d=0;d<elementsN;d++) {
      if(elements[d].className.indexOf(classname)!=-1) {
        selection.push(elements[d]);
      }
    }
    return selection;
  },
  previousElementSibling:function(elem){
    do {
      elem = elem.previousSibling;
    } while ( elem && elem.nodeType !== 1 );
    return elem;
  },
  nextElementSibling:function(elem){
    do {
      elem = elem.nextSibling;
    } while ( elem && elem.nodeType !== 1 );
    return elem;
  },
  addevent:function(obj,type,fn,capture){
    if(obj) {
      if (obj.attachEvent) {
        obj['e'+type+fn] = fn;
        obj[type+fn] = function(){obj['e'+type+fn](window.event);}
        obj.attachEvent('on'+type, obj[type+fn]);
      } else
        obj.addEventListener(type, fn, false);
    }
  },
  delevent:function(obj, type, fn, capture){
    if (obj.detachEvent) {
      obj.detachEvent('on'+type, obj[type+fn]);
      obj[type+fn] = null;
    } else
      obj.removeEventListener(type, fn, false);
  },
  getFocus:function(e){
    var focused;
    if (!e) var e = window.event;
    if (e.target) focused = e.target;
    else if (e.srcElement) focused = e.srcElement;
    if (focused.nodeType == 3) focused = focused.parentNode;
    if (document.querySelector) {
      return focused.id;
    } else if (!focused || focused == document.documentElement) {
      return focused;
    }
  },
  donations: {
    setDonationEvents:function() {
      if(document.getElementById('donationForm')) {
        var obj=donate.getElementsByTagAndClassName('label','square');
        for(var x=0; x<obj.length; x++) {
          radioId = obj[x].getAttribute('for');
          radio = document.getElementById(radioId);
          donate.addevent(radio,'click',function(event){donate.donations.clearInputGroup('donationAmount',event);},false);
          if(radioId == "donationCustom") {
            customInput = document.getElementById('donationAmountCustom');
            submitButton = document.getElementById('donationSubmit');
            donate.addevent(radio,'click',function(){customInput.focus();},false);
            donate.addevent(customInput,'focus',function(event){donate.donations.clearInputGroup('donationAmount',event);},false);
            donate.addevent(customInput,'click',function(event){donate.donations.clearInputGroup('donationAmount',event);},false);
            donate.addevent(submitButton,'click',function(event){donate.donations.checkInput(event);},false);
          }
        }
      }
    },
    checkInput:function(e) {
      donate.donations.isEmpty('donationAmount',e);
      donate.donations.isEmail('donationEmail',e);
    },
    isEmail:function(id,e) {
      var email = document.getElementById('donationEmailaddress'),
          fs = document.getElementById(id),
          regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(regex.test(email.value)) return true;
      e.preventDefault();
      fs.classList.toggle('shaker');
      email.focus();
      setTimeout(function(){fs.classList.toggle('shaker');}, 820);
    },
    clearInputGroup:function(fieldsetId,e) {
      var fs = document.getElementById(fieldsetId),
          inputElems = fs.getElementsByTagName('input'),
          elem = donate.getFocus(e);
      for(var i=0; i<inputElems.length; i++) {
        if(inputElems[i].id != elem) {
          if(inputElems[i].getAttribute('type')=='radio') {
            if(donate.nextElementSibling(inputElems[i]).getElementsByTagName('input').length==0) inputElems[i].checked = false;
          } else {
            if(inputElems[i].getAttribute('type')=='number' || inputElems[i].getAttribute('type')=='text') {
              if(donate.previousElementSibling(inputElems[i].parentNode).checked === false) inputElems[i].value = "";
            }
          }
        } else {
          if(inputElems[i].type==='radio') inputElems[i].checked = true;
          else donate.previousElementSibling(inputElems[i].parentNode).checked = true;
        }
      }
    },
    isEmpty:function(fieldsetId,e) {
      var fs = document.getElementById(fieldsetId),
          inputElems = fs.getElementsByTagName('input'),
          set;
      for(var i=0; i<inputElems.length; i++) {
        if(inputElems[i].getAttribute('type')!='submit') {
          if(inputElems[i].getAttribute('type')=='radio') {
            if(inputElems[i].checked == true && inputElems[i].value != 'x') return true;
          }
          if(inputElems[i].getAttribute('type')=='number' || inputElems[i].getAttribute('type')=='text') {
            if(inputElems[i].value != "") return true;
          }
        }
      }
      e.preventDefault();
      fs.classList.toggle('shaker');
      setTimeout(function(){fs.classList.toggle('shaker');}, 820);
    }
  }
}
donate.addevent(window,"load",function(){donate.donations.setDonationEvents();},false);
