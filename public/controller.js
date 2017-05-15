angular.module('vibgyorApp', [])
  .controller('mainController', function ($timeout, $http) {
    var mc = this,
      defaultMember = {
        id: 0,
        name: 'Who is it?'
      },
      randomIndexList,
      indexList = [0, 1, 2, 3, 4, 5, 6],
      colorList = ['violet', 'indigo', 'blue', 'green', 'yellow', 'orange', 'red'];

    mc.memberList =  [{
      id: 0,
      name: 'Who is it?'
    }];
    mc.round = 0;
    mc.class = [];

    function getMembers () {
      return $http.get('api/members/7')
      .then(function (response) {
        response.data.result.unshift(defaultMember);
        mc.memberList = response.data.result;
      });
    }

    function resetClasses () {
      mc.class = [];
    }

    function setColorInfo (list) {
      var counter;
      for (counter = 0; counter < list.length; counter++) {
        mc.class[counter] = 'spinner-' + list[counter];
        mc.memberList[counter + 1].colour =  colorList[list.indexOf(counter)];
      }
    }

    function saveMemberData (list) {
      list.shift();
      console.log(list);
    }

    mc.spinner = function () {
      if (mc.round > 0) {
        saveMemberData(mc.memberList);
        resetClasses();
        mc.memberList = [defaultMember];
      }
      mc.round++;

      mc.spinnerClass = 'glow';

      $timeout(function () {
      }, 3000)
      .then(function () {
        getMembers()
        .then(function () {
          mc.spinnerClass = '';
          randomIndexList = randomArray(indexList.slice(0, mc.memberList.length -1));
          setColorInfo(randomIndexList);
        });
      });
    };

    function randomArray(array) {
      var elementsRemaining = array.length, temp, randomIndex;
      while (elementsRemaining > 1) {
        randomIndex = Math.floor(Math.random() * elementsRemaining--);
        if (randomIndex != elementsRemaining) {
          temp = array[elementsRemaining];
          array[elementsRemaining] = array[randomIndex];
          array[randomIndex] = temp;
        }
      }
      return array;
    }
  });