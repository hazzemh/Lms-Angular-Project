import { Component, OnInit } from '@angular/core';
import { UserManagementService } from '../services/user management service/user-management.service';

@Component({
  selector: 'app-accounts-management',
  templateUrl: './accounts-management.component.html',
  styleUrl: './accounts-management.component.css'
})
export class AccountsManagementComponent implements OnInit {
  users!: any[];  // Adjust type as per your model

  constructor(private userManagementService: UserManagementService) {}

  ngOnInit() {
    this.userManagementService.fetchUsers().subscribe(users => {
      this.users = users;
    });
  }

  toggleUserStatus(user: any) {
    const newStatus = user.status === 'active' ? false : true;
    this.userManagementService.updateUserStatus(user.uid, newStatus);
  }

  deleteUser(userId: string) {
    this.userManagementService.deleteUser(userId);
  }
}
