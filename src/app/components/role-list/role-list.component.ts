import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Role } from '../../interfaces/role';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.css'
})


export class RoleListComponent {
  @Input({required : true})roles!: Role[]|null;
  @Output() deleteRole :EventEmitter<string> = new EventEmitter<string>();


  ngOnChanges(changes: SimpleChanges) {
    if (changes['roles']) {
      console.log('Previous roles:', changes['roles'].previousValue);
      console.log('Current roles:', changes['roles'].currentValue);
      console.log('Roles changed:', this.roles);
    }
  }

  delete(id:string){
    this.deleteRole.emit(id);

  }



}
