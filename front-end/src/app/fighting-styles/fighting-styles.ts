import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Fightingstyle {
  image: string;
  name: string;
  moves: string[];
  rarity: string;
  cost: {
    belly: number;
    fragments: number;
  };
  requirements: {
    mastery: number | null;
    other_styles: string[] | null;
    items: string[] | null;
  };
  where_to_buy: {
    npc: string;
    locations: string[];
  };
}

@Component({
  selector: 'app-fighting-styles',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
  templateUrl: './fighting-styles.html',
  styleUrl: './fighting-styles.css',
})
export class FightingStyles implements OnInit {

  styles: Fightingstyle[] = [];
  searchText = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const savedStyles = localStorage.getItem('fighting_styles');

    if (savedStyles) {
      this.styles = JSON.parse(savedStyles);
      console.log('Loaded from localStorage');
      return;
    }

    this.http
      .get<{ fighting_styles: Fightingstyle[] }>(
        'assets/data/JSON/fighting-style.json'
      )
      .subscribe({
        next: (data) => {
          this.styles = data.fighting_styles;

          localStorage.setItem(
            'fighting_styles',
            JSON.stringify(this.styles)
          );

          console.log('Loaded from JSON');
        },
        error: (err) => {
          console.error('HTTP Error:', err);
        }
      });
  }

  filteredStyles(): Fightingstyle[] {  
    if (!this.searchText.trim()) {
      return this.styles;
    }

    return this.styles.filter(style =>
      style.name
        .toLowerCase()
        .includes(this.searchText.toLowerCase())
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

  openDetails(style: Fightingstyle) {
    this.router.navigate(['/fighting-style', style.name]);
  }
}
