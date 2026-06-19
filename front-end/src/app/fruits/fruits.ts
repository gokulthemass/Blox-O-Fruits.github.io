import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


interface fruits {
  name: string;
  value: string
  image: string;
  rarity: string;
  fruit_type: string;
  trend: string;
  demand: number;
  price_beli: number;
  price_robux: number;
  best_for: string;
  moves: Array<{
    name: string;
    key: string;
    mastery: number;
    description: string;
  }>;
}
@Component({
  selector: 'app-fruits',
  imports: [FormsModule, CommonModule],
  templateUrl: './fruits.html',
  styleUrl: './fruits.css',
})
export class Fruits implements OnInit{
  fruitArray: fruits[] = [];
  searchText = '';

  constructor(private http: HttpClient, private router: Router) {}

 ngOnInit(): void {

  const savedContent = localStorage.getItem('allfruit');



  this.http
    .get<{ allfruit: fruits[] }>('assets/data/JSON/fruits.json')
    .subscribe({
      next: (data) => {
        this.fruitArray = data.allfruit;

        localStorage.setItem(
          'allfruit',
          JSON.stringify(this.fruitArray)
        );

        console.log('Loaded from JSON!');
      }
    });
}

  filteredFruits(): fruits[] {
    if(!this.searchText.trim()){
      return this.fruitArray;
    }

    return this.fruitArray.filter(fruit => 
      fruit.name.toLowerCase().includes(this.searchText.toLowerCase()) 
    );
  }

  rarityClass(rarity: string): string {
    switch (rarity.toLowerCase()) {
      case 'common':
        return 'bg-gray-500';

      case 'uncommon':
        return 'bg-green-500';

      case 'rare':
        return 'bg-blue-500';

      case 'epic':
        return 'bg-purple-500';

      case 'legendary':
        return 'bg-orange-500';

      case 'mythical':
        return 'bg-red-500';

      default:
        return 'bg-gray-700';
    }
  }

formatValue(value: string | null): string {
  if (!value) return 'N/A';

  const num = Number(value);

  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace('.0', '') + 'B';
  }

  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace('.0', '') + 'M';
  }

  return num.toString();
}

  openDetails(fruit: fruits){
    this.router.navigate(['/fruits', fruit.name]);
  }
}
