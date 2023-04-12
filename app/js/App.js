import NotesView from "./NotesView.js";
import NotesAPI from "./NotesAPI.js";

export default class App {
    constructor(root) {
        this.notes = [];
        this.activeNote = null;
        this.view = new NotesView(root, this._handlers());

        this._refreshNotes();
    }

    _refreshNotes() {
        const notes = NotesAPI.getAllNotes();
        const inpSearch = this.view.root.querySelector(".notes__search");
        const query = inpSearch.value.trim().toLowerCase();
    
        if (query !== "") {
            const filteredNotes = notes.filter(note =>
                note.title.toLowerCase().includes(query) ||
                note.body.toLowerCase().includes(query)
            );
            this._setNotes(filteredNotes);
        } else {
            this._setNotes(notes);
        }
    
        if (notes.length > 0) {
            this._setActiveNote(notes[0]);
        }
    }
    

    _setNotes(notes) {
        this.notes = notes;
        this.view.updateNoteList(notes);
        this.view.updateNotePreviewVisibility(notes.length > 0);
    }

    _setActiveNote(note) {
        this.activeNote = note;
        this.view.updateActiveNote(note);
    }

    _handlers() {
        return {
            onNoteSelect: noteId => {
                const selectedNote = this.notes.find(note => note.id == noteId);
                this._setActiveNote(selectedNote);
            },
            onNoteAdd: () => {
                const newNote = {
                    title: "New Note",
                    body: "Take note..."
                };
        
                NotesAPI.saveNote(newNote);
                this._refreshNotes();
            },
            onNoteEdit: (title, body) => {
                NotesAPI.saveNote({
                    id: this.activeNote.id,
                    title,
                    body
                });
        
                this._refreshNotes();
            },
            onNoteDelete: noteId => {
                NotesAPI.deleteNote(noteId);
                this._refreshNotes();
            },
            onNoteSearch: query => {
                const filteredNotes = this.notes.filter(note =>
                    note.title.toLowerCase().includes(query) ||
                    note.body.toLowerCase().includes(query)
                );
                this._setNotes(filteredNotes);
            }
        };
    }
}
