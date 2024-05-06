import { Component, OnInit } from '@angular/core';
import { UserManagementService } from '../services/user management service/user-management.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-accounts-management',
  templateUrl: './accounts-management.component.html',
  styleUrls: ['./accounts-management.component.css'] // Fixed 'styleUrls' instead of 'styleUrl'
})
export class AccountsManagementComponent implements OnInit {
  users!: any[];

  constructor(private userManagementService: UserManagementService) {}

  ngOnInit() {
    this.userManagementService.fetchUsers().subscribe(users => {
      this.users = users;
    });
  }

  toggleUserStatus(user: any) {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    this.userManagementService.updateUserStatus(user.uid, newStatus === 'active');
  }

  deleteUser(userId: string) {
    Swal.fire({
      title: 'Are you sure you want to delete this user?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userManagementService.deleteUser(userId);
      }
    });
  }
  
  
}
