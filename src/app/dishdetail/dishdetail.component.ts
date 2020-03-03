import { Component, OnInit , ViewChild} from "@angular/core";
import { Params, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { Dish } from "../shared/dish";
import { DishService } from "../services/dish.service";
import { switchMap } from "rxjs/operators";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Comment } from "../shared/comment";
@Component({
  selector: "app-dishdetail",
  templateUrl: "./dishdetail.component.html",
  styleUrls: ["./dishdetail.component.scss"]
})
export class DishdetailComponent implements OnInit {
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  commentForm: FormGroup;
  comment1: Comment;
    
  @ViewChild("fform") commentFormDirective;
  

  formErrors = {
    'author': '',
    'comment':''
  };

  validationMessages = {
    'author': {
      'required': "author name is required.",
      'minlength': "author name must be at least 2 charaters long.",
      'maxlength': "author name cannot be more 25 characters long."
    },
    'comment':{
      'required':"Comment is required."
    }
  };

  constructor(
    private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.dishService
      .getDishIds()
      .subscribe(dishIds => (this.dishIds = dishIds));
    this.route.params
      .pipe(
        switchMap((params: Params) => this.dishService.getDish(params["id"]))
      )
      .subscribe(dish => {
        this.dish = dish;
        this.setPrevNext(dish.id);
      });
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[
      (this.dishIds.length + index - 1) % this.dishIds.length
    ];
    this.next = this.dishIds[
      (this.dishIds.length + index + 1) % this.dishIds.length
    ];
  }

  goBack(): void {
    this.location.back();
  }
  createForm(): void {
    this.commentForm = this.fb.group({
      author: [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(25)]
      ],
      rating:[3],
      comment : ['' , [Validators.required]]
    });
    this.commentForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }
  onValueChanged(data?: any) {
    if (!this.commentForm) {
      return;
    }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + '';
            }
          }
        }
      }
    }
  }
  onSubmit(commentForm) {
    this.comment1 = this.commentForm.value;
    this.comment1.date = new Date().toISOString();
    console.log(this.comment1);
    this.dish.comments.push(this.comment1);
    this.commentForm.reset({
      author: "",
      rating:5,
      comment:""
    });
    //  this.commentFormDirective.resetForm();
  }
  
}
