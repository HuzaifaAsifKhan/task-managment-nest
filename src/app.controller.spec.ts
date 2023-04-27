import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});


// class FriendList {
//   friends = [];

//   addFriend(name: string) {
//     this.friends.push(name);
//     this.announceFriendName(name);
//   }

//   announceFriendName(name: string) {
//     global.console.log(name);
//   }

//   removeFriend(name: string) {
//     const idx = this.friends.indexOf(name);
//     if (idx == -1) {
//       throw new Error('Friend not Found')
//     }
//     this.friends.splice(idx, 1);
//   }
// }


// describe('FriendList', () => {
//   let friend: FriendList;

//   beforeEach(async () => {
//     friend = new FriendList();
//   })

//   it('initialize a list', () => {
//     expect(friend.friends.length).toBe(0);
//   });

//   it('add a friend to list', () => {
//     friend.addFriend('HUZAIFA');
//     expect(friend.friends.length).toBe(1);
//   });

//   it('announce Friend', () => {
//     friend.announceFriendName = jest.fn();
//     expect(friend.announceFriendName).not.toHaveBeenCalled();
//     friend.addFriend('HUZAIFA');
//     expect(friend.announceFriendName).toHaveBeenCalledWith('HUZAIFA');
//   });

//   describe('Remove Friend', () => {
//     it('Remove a friend from list', () => {
//       friend.addFriend('HUZAIFA');
//       expect(friend.friends[0]).toBe('HUZAIFA');
//       friend.removeFriend('HUZAIFA');
//       expect(friend.friends[0]).toBeUndefined();
//     });

//     it('Throw an Error if not exsits', () => {
//       expect(() => friend.removeFriend('HUZAIFA')).toThrow();
//     })
//   });

// })
