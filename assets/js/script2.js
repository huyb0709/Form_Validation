function Validator(formSelector){

    function getParent(element,selector){
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement
            }
            element = element.parentElement
        }
    }


    var formRules = {};
    var validatorRules = {
        required: function(value){
            return value? undefined : 'Vui lòng nhập trường này '},
        email: function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : 'Vui nhập email'},
        min: function(value){
            return function(min){
                return value.length >= min ? undefined : `Nhập ít nhất ${min} kí tự `
            }
        },
        max: function(value){
            return function(max){
                return value.length <= max ? undefined : `Nhập tối đa ${max} kí tự `
            }
        },
    };
    var ruleName = 'required';
    // Lấy ra form trong dom theo formselector
    var formElement = document.querySelector(formSelector);
    //
    if(formElement){
        var inputs = formElement.querySelectorAll('[name][rules]');
        for (var input of inputs){
            var rules = input.getAttribute('rules').split('|'); 
            for (var rule of rules){
                var ruleInfo;
                var isRulesHasValue = rule.includes(':')
                if(isRulesHasValue){
                    ruleInfo = rule.split(':');
                    rule = ruleInfo[0];
                }
                var ruleFunc = validatorRules[rule];
                if(isRulesHasValue){
                    ruleFunc = ruleFunc(ruleInfo[1])
                }
                if(Array.isArray(formRules[input.name])){
                    formRules[input.name].push(ruleFunc)
                } else{
                    formRules[input.name] = [ruleFunc];
                }
            }   
            // Lắng nghe sự kiện để validate ( blur, change,...)
            input.onblur = handleValidate;
        }
        function handleValidate(event){
            var rules = formRules[event.target.name]
            var errorMessage;

            rules.find(function(rule){
                errorMessage =  rule(event.target.value)
                return errorMessage
            })
            if(errorMessage){
                var formGroup = getParent(event.target, '.form-group')
                if(formGroup){
                    var formMessage = formGroup.querySelector('.form-message');
                    if(formMessage){
                        formMessage.innerText = errorMessage
                    }
                }
            }
        }
    }

}