import { Component, OnInit } from '@angular/core';
import { UserManagementService } from '../services/user management service/user-management.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-accounts-management',
  templateUrl: './accounts-management.component.html',
  styleUrls: ['./accounts-management.component.css'] 
})
export class AccountsManagementComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchText: string = '';
  selectedUser: any = null; 

  constructor(private userManagementService: UserManagementService) {}

  ngOnInit() {
    this.userManagementService.fetchUsers().subscribe(users => {
      this.users = users;
      this.filteredUsers = users;
    });
  }

  onSearchTextChanged() {
    this.filteredUsers = this.searchText ? this.filterUsers(this.searchText) : this.users;
  }

  filterUsers(query: string): any[] {
    return this.users.filter(user => user.name.toLowerCase().includes(query) ||
                                      user.email.toLowerCase().includes(query) ||
                                      user.role.toLowerCase().includes(query) ||
                                      user.status.toLowerCase().includes(query));
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
  selectUser(user: any) { 
    this.selectedUser = user;
  }
  
}
