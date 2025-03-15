import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { GymClass } from '../../../shared/interfaces/gym-class.interface';
import { GymClassService } from '../../../shared/services/gym-class/gym-class.service';
import { lastValueFrom } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { Dialog } from 'primeng/dialog';
import { FloatLabel } from 'primeng/floatlabel';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { FluidModule } from 'primeng/fluid';
import { InputNumber } from 'primeng/inputnumber';
import { SelectButtonModule } from 'primeng/selectbutton';
import { IftaLabelModule } from 'primeng/iftalabel';
import { MessageService } from 'primeng/api';
import { CreateGymClassDTO } from '../../../shared/interfaces/create-gym-class.interface';
import { GymclassStatus } from '../../../shared/enums/gym-class-status.enum';
import { GymClassModalMode } from '../../../shared/enums/gym-class-modal.enum';
import { DifficultyPipe } from '../../../shared/pipes/difficulty.pipe';

@Component({
  selector: 'app-manage-classes',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    TableModule,
    DialogModule,
    DifficultyPipe,
    InputTextModule,
    Dialog,
    FloatLabel,
    DatePickerModule,
    FluidModule,
    InputNumber,
    SelectButtonModule,
    IftaLabelModule,
  ],
  templateUrl: './manage-classes.component.html',
  styleUrl: './manage-classes.component.scss',
})
export class ManageClassesComponent implements OnInit {
  dialogVisible: boolean = false;
  gymClassesList: GymClass[] = [];
  GymClassModalMode = GymClassModalMode;
  mode: GymClassModalMode = GymClassModalMode.CREATE;
  selectedGymClass: GymClass | null = null;
  form: FormGroup;

  // Pagination
  first = 0; // Start index for records (PrimeNG default)
  rows = 10; // Page size (records per page)
  totalRecords = 0; // Total number of records

  difficultyOptions: any[] = [
    { name: 'Easy', value: 0 },
    { name: 'Medium', value: 1 },
    { name: 'Hard', value: 2 },
  ];

  showDialog(mode: GymClassModalMode, gymClass?: GymClass) {
    this.mode = mode;
    this.dialogVisible = true;

    if (mode === GymClassModalMode.EDIT && gymClass) {
      this.selectedGymClass = gymClass;

      this.form.patchValue({
        name: gymClass.name,
        duration: gymClass.duration,
        maxParticipants: gymClass.maxParticipants,
        day: gymClass.day ? new Date(gymClass.day) : null,
        difficulty: gymClass.difficulty,
      });

    } else {
      this.selectedGymClass = null;
      this.form.reset();
    }
  }

  deleteClass(gymClass: GymClass) {
    this.gymClassService.delete(gymClass.id).subscribe({
      next: (val) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Awesome',
          detail: 'Class deleted successfully',
          life: 3000,
        });
        this.loadList();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
          life: 3000,
        });
      },
    });
  }

  constructor(
    private gymClassService: GymClassService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      day: [null, Validators.required],
      duration: [0, [Validators.required]],
      difficulty: [null, Validators.required],
      maxParticipants: [1, [Validators.required]],
    });
  }

  async ngOnInit(): Promise<void> {
    await this.loadList();
  }

  pageChange(event: any) {
    this.first = event.first; // Update first record index
    this.rows = event.rows; // Update rows per page
    this.loadList();
  }

  async loadList() {
    const pageNumber = this.first / this.rows + 1;
    const t = (
      await lastValueFrom(this.gymClassService.getAll(pageNumber, this.rows))
    ).data;
    this.gymClassesList = t?.data || [];
    this.totalRecords = t?.totalRecords || 0;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.form.markAsDirty();
      this.messageService.add({
        severity: 'warn',
        summary: 'Watch out!',
        detail: 'Must fill all fields',
        life: 3000,
      });
      return;
    }

    if (this.mode === GymClassModalMode.CREATE) {
      const gymClass: CreateGymClassDTO = {
        ...this.form.value,
        status: GymclassStatus.Available,
      };

      this.gymClassService.create(gymClass).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Class created successfully',
            life: 3000,
          });
          this.dialogVisible = false;
          this.form.reset();
          this.loadList();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.errors,
            life: 3000,
          });
        },
      });
    } else if (this.mode === GymClassModalMode.EDIT && this.selectedGymClass) {
      const updatedGymClass = { ...this.selectedGymClass, ...this.form.value };

      this.gymClassService.update(updatedGymClass).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Class updated successfully',
            life: 3000,
          });
          this.dialogVisible = false;
          this.form.reset();
          this.loadList();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.errors,
            life: 3000,
          });
        },
      });
    }
  }

  get name() {
    return this.form.get('name');
  }

  get day() {
    return this.form.get('day');
  }

  get duration() {
    return this.form.get('duration');
  }

  get difficulty() {
    return this.form.get('difficulty');
  }

  get maxParticipants() {
    return this.form.get('maxParticipants');
  }
}
