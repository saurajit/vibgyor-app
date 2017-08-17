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
    mc.class = [];
    mc.memberSize = 7;

    function getRemainingRounds (remainingMembers) {
      return Math.ceil(remainingMembers / mc.memberSize);
    }

    function getMembers () {
      return $http.get('api/members/' + mc.memberSize)
      .then(function (response) {
        response.data.result.members.unshift(defaultMember);
        mc.memberList = response.data.result.members;
        mc.remainingRounds = getRemainingRounds(response.data.result.remaining);
      }, function (error) {
        console.log(error);
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
      $http.put('api/members', list)
      .then(function (response) {
        console.log(response);
      });
    }

    mc.spinner = function () {
      if (mc.remainingRounds > 0) {
        saveMemberData(mc.memberList);
        resetClasses();
        mc.memberList = [defaultMember];
      }

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