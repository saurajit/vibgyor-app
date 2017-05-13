angular.module('vibgyorApp', [])
  .controller('mainController', function ($timeout) {
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

    var memberList = [
      {
        id: 1,
        name: 'Saurajit Bhuyan'
      },
      {
        id: 2,
        name: 'Carlos Guerra'
      },
      {
        id: 3,
        name: 'Pranjal Goswami'
      },
      {
        id: 4,
        name: 'Ujjal Sharma'
      },
      {
        id: 4,
        name: 'Ranjan Choudhary'
      },
      {
        id: 1,
        name: 'Intazuddin Ahmed'
      },
      {
        id: 1,
        name: 'Sachin Mishra'
      }
    ];

    function getMembers () {
      var list = [];
      angular.copy(memberList, list);
      list.unshift(defaultMember);
      return list;
    }

    function resetClasses () {
      mc.class = [];
      mc.memberList.splice(1, mc.memberList - 1);
    }

    function setColorInfo (list) {
      var counter;
      for (counter = 0; counter < list.length; counter++) {
        mc.class[counter] = 'spinner-' + list[counter];
        mc.memberList[counter + 1].color =  colorList[list.indexOf(counter)];
      }
    }

    function saveMemberData () {
      var list = mc.memberList;
      list.shift();
      console.log(list);
    }

    mc.spinner = function () {
      if (mc.round > 0) {
        resetClasses();
        saveMemberData();
      }
      mc.round++;

      mc.spinnerClass = 'glow';

      $timeout(function () {
      }, 3000)
      .then(function () {
        mc.spinnerClass = '';
        mc.memberList = getMembers();
        randomIndexList = randomArray(indexList.slice(0, mc.memberList.length -1));
        setColorInfo(randomIndexList);
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