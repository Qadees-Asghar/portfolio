// ============================================================
//   CHESS GAME - Complete Single File
//   Features: 2 Player, Basic AI, Save/Load, Move History
//   UI: Windows Forms
//   How to use:
//     1. Open Visual Studio
//     2. Create new "Windows Forms App (.NET Framework)" project
//     3. Replace ALL content of Form1.cs with this file
//     4. Build and Run (F5)
// ============================================================

using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace ChessGame
{
    // ============================================================
    // ENUMS
    // ============================================================
    public enum PieceColor { White, Black, None }
    public enum PieceType  { King, Queen, Rook, Bishop, Knight, Pawn, None }
    public enum GameMode   { TwoPlayer, VsAI }

    // ============================================================
    // PIECE BASE CLASS + ALL 6 PIECE TYPES
    // ============================================================
    public abstract class Piece
    {
        public PieceColor Color { get; set; }
        public PieceType  Type  { get; protected set; }
        public bool HasMoved   { get; set; } = false;

        protected Piece(PieceColor color) { Color = color; }

        // Returns all valid destination squares for this piece
        public abstract List<(int row, int col)> GetValidMoves(Board board, int row, int col);

        // Helper: add move if within bounds
        protected bool InBounds(int r, int c) => r >= 0 && r < 8 && c >= 0 && c < 8;

        // Helper: slide in a direction (rook/bishop/queen)
        protected List<(int, int)> Slide(Board board, int row, int col, int dr, int dc)
        {
            var moves = new List<(int, int)>();
            int r = row + dr, c = col + dc;
            while (InBounds(r, c))
            {
                if (board.Grid[r, c] == null) { moves.Add((r, c)); }
                else
                {
                    if (board.Grid[r, c].Color != Color) moves.Add((r, c));
                    break;
                }
                r += dr; c += dc;
            }
            return moves;
        }

        public override string ToString() => $"{Color} {Type}";
    }

    public class King : Piece
    {
        public King(PieceColor color) : base(color) { Type = PieceType.King; }
        public override List<(int, int)> GetValidMoves(Board board, int row, int col)
        {
            var moves = new List<(int, int)>();
            int[] d = { -1, 0, 1 };
            foreach (int dr in d)
                foreach (int dc in d)
                {
                    if (dr == 0 && dc == 0) continue;
                    int r = row + dr, c = col + dc;
                    if (InBounds(r, c) && (board.Grid[r, c] == null || board.Grid[r, c].Color != Color))
                        moves.Add((r, c));
                }
            // Castling
            if (!HasMoved)
            {
                // Kingside
                if (board.Grid[row, col + 1] == null && board.Grid[row, col + 2] == null)
                {
                    var rook = board.Grid[row, 7];
                    if (rook != null && rook.Type == PieceType.Rook && !rook.HasMoved)
                        moves.Add((row, col + 2));
                }
                // Queenside
                if (board.Grid[row, col - 1] == null && board.Grid[row, col - 2] == null && board.Grid[row, col - 3] == null)
                {
                    var rook = board.Grid[row, 0];
                    if (rook != null && rook.Type == PieceType.Rook && !rook.HasMoved)
                        moves.Add((row, col - 2));
                }
            }
            return moves;
        }
    }

    public class Queen : Piece
    {
        public Queen(PieceColor color) : base(color) { Type = PieceType.Queen; }
        public override List<(int, int)> GetValidMoves(Board board, int row, int col)
        {
            var moves = new List<(int, int)>();
            int[][] dirs = { new[]{1,0},new[]{-1,0},new[]{0,1},new[]{0,-1},
                             new[]{1,1},new[]{1,-1},new[]{-1,1},new[]{-1,-1} };
            foreach (var d in dirs) moves.AddRange(Slide(board, row, col, d[0], d[1]));
            return moves;
        }
    }

    public class Rook : Piece
    {
        public Rook(PieceColor color) : base(color) { Type = PieceType.Rook; }
        public override List<(int, int)> GetValidMoves(Board board, int row, int col)
        {
            var moves = new List<(int, int)>();
            int[][] dirs = { new[]{1,0},new[]{-1,0},new[]{0,1},new[]{0,-1} };
            foreach (var d in dirs) moves.AddRange(Slide(board, row, col, d[0], d[1]));
            return moves;
        }
    }

    public class Bishop : Piece
    {
        public Bishop(PieceColor color) : base(color) { Type = PieceType.Bishop; }
        public override List<(int, int)> GetValidMoves(Board board, int row, int col)
        {
            var moves = new List<(int, int)>();
            int[][] dirs = { new[]{1,1},new[]{1,-1},new[]{-1,1},new[]{-1,-1} };
            foreach (var d in dirs) moves.AddRange(Slide(board, row, col, d[0], d[1]));
            return moves;
        }
    }

    public class Knight : Piece
    {
        public Knight(PieceColor color) : base(color) { Type = PieceType.Knight; }
        public override List<(int, int)> GetValidMoves(Board board, int row, int col)
        {
            var moves = new List<(int, int)>();
            int[][] jumps = { new[]{-2,-1},new[]{-2,1},new[]{-1,-2},new[]{-1,2},
                              new[]{1,-2},new[]{1,2},new[]{2,-1},new[]{2,1} };
            foreach (var j in jumps)
            {
                int r = row + j[0], c = col + j[1];
                if (InBounds(r, c) && (board.Grid[r, c] == null || board.Grid[r, c].Color != Color))
                    moves.Add((r, c));
            }
            return moves;
        }
    }

    public class Pawn : Piece
    {
        public Pawn(PieceColor color) : base(color) { Type = PieceType.Pawn; }
        public override List<(int, int)> GetValidMoves(Board board, int row, int col)
        {
            var moves = new List<(int, int)>();
            int dir = (Color == PieceColor.White) ? -1 : 1;

            // Forward
            if (InBounds(row + dir, col) && board.Grid[row + dir, col] == null)
            {
                moves.Add((row + dir, col));
                // Double from start
                int startRow = (Color == PieceColor.White) ? 6 : 1;
                if (row == startRow && board.Grid[row + 2 * dir, col] == null)
                    moves.Add((row + 2 * dir, col));
            }

            // Captures
            foreach (int dc in new[] { -1, 1 })
            {
                int r = row + dir, c = col + dc;
                if (InBounds(r, c) && board.Grid[r, c] != null && board.Grid[r, c].Color != Color)
                    moves.Add((r, c));
            }

            // En passant
            if (board.EnPassantTarget.HasValue)
            {
                var ep = board.EnPassantTarget.Value;
                if (ep.row == row + dir && Math.Abs(ep.col - col) == 1)
                    moves.Add((ep.row, ep.col));
            }

            return moves;
        }
    }

    // ============================================================
    // BOARD CLASS
    // ============================================================
    public class Board
    {
        public Piece[,] Grid { get; private set; } = new Piece[8, 8];
        public (int row, int col)? EnPassantTarget { get; set; } = null;

        public Board() { SetupInitialPosition(); }

        // Deep copy constructor for AI simulation
        public Board(Board other)
        {
            Grid = new Piece[8, 8];
            for (int r = 0; r < 8; r++)
                for (int c = 0; c < 8; c++)
                    Grid[r, c] = other.Grid[r, c]; // pieces are reused (read-only in simulation)
            EnPassantTarget = other.EnPassantTarget;
        }

        public void SetupInitialPosition()
        {
            // Black back rank
            Grid[0, 0] = new Rook(PieceColor.Black);
            Grid[0, 1] = new Knight(PieceColor.Black);
            Grid[0, 2] = new Bishop(PieceColor.Black);
            Grid[0, 3] = new Queen(PieceColor.Black);
            Grid[0, 4] = new King(PieceColor.Black);
            Grid[0, 5] = new Bishop(PieceColor.Black);
            Grid[0, 6] = new Knight(PieceColor.Black);
            Grid[0, 7] = new Rook(PieceColor.Black);
            for (int c = 0; c < 8; c++) Grid[1, c] = new Pawn(PieceColor.Black);

            // White back rank
            Grid[7, 0] = new Rook(PieceColor.White);
            Grid[7, 1] = new Knight(PieceColor.White);
            Grid[7, 2] = new Bishop(PieceColor.White);
            Grid[7, 3] = new Queen(PieceColor.White);
            Grid[7, 4] = new King(PieceColor.White);
            Grid[7, 5] = new Bishop(PieceColor.White);
            Grid[7, 6] = new Knight(PieceColor.White);
            Grid[7, 7] = new Rook(PieceColor.White);
            for (int c = 0; c < 8; c++) Grid[6, c] = new Pawn(PieceColor.White);
        }

        // Returns position of the king of given color
        public (int row, int col) FindKing(PieceColor color)
        {
            for (int r = 0; r < 8; r++)
                for (int c = 0; c < 8; c++)
                    if (Grid[r, c] != null && Grid[r, c].Type == PieceType.King && Grid[r, c].Color == color)
                        return (r, c);
            return (-1, -1);
        }

        // Is the given color's king in check?
        public bool IsInCheck(PieceColor color)
        {
            var kingPos = FindKing(color);
            PieceColor enemy = (color == PieceColor.White) ? PieceColor.Black : PieceColor.White;
            for (int r = 0; r < 8; r++)
                for (int c = 0; c < 8; c++)
                    if (Grid[r, c] != null && Grid[r, c].Color == enemy)
                    {
                        var moves = Grid[r, c].GetValidMoves(this, r, c);
                        if (moves.Contains(kingPos)) return true;
                    }
            return false;
        }

        // Get all legal moves for a color (filters out moves that leave king in check)
        public List<(int fr, int fc, int tr, int tc)> GetAllLegalMoves(PieceColor color)
        {
            var result = new List<(int, int, int, int)>();
            for (int r = 0; r < 8; r++)
                for (int c = 0; c < 8; c++)
                    if (Grid[r, c] != null && Grid[r, c].Color == color)
                        foreach (var move in Grid[r, c].GetValidMoves(this, r, c))
                            if (!MoveLeavesKingInCheck(color, r, c, move.row, move.col))
                                result.Add((r, c, move.row, move.col));
            return result;
        }

        public bool MoveLeavesKingInCheck(PieceColor color, int fr, int fc, int tr, int tc)
        {
            var sim = new Board(this);
            sim.Grid[tr, tc] = sim.Grid[fr, fc];
            sim.Grid[fr, fc] = null;
            return sim.IsInCheck(color);
        }

        // Execute a move and return algebraic notation string
        public string ExecuteMove(int fr, int fc, int tr, int tc)
        {
            Piece piece = Grid[fr, fc];
            Piece captured = Grid[tr, tc];
            string notation = BuildNotation(piece, fr, fc, tr, tc, captured);

            // En passant capture
            if (piece.Type == PieceType.Pawn && EnPassantTarget.HasValue &&
                tr == EnPassantTarget.Value.row && tc == EnPassantTarget.Value.col)
            {
                int capturedPawnRow = fr;
                Grid[capturedPawnRow, tc] = null;
            }

            // Reset en passant
            EnPassantTarget = null;

            // Set en passant target for double pawn push
            if (piece.Type == PieceType.Pawn && Math.Abs(tr - fr) == 2)
                EnPassantTarget = ((fr + tr) / 2, tc);

            // Castling
            if (piece.Type == PieceType.King && Math.Abs(tc - fc) == 2)
            {
                if (tc > fc) // Kingside
                {
                    Grid[fr, tc - 1] = Grid[fr, 7];
                    Grid[fr, 7] = null;
                    if (Grid[fr, tc - 1] != null) Grid[fr, tc - 1].HasMoved = true;
                }
                else // Queenside
                {
                    Grid[fr, tc + 1] = Grid[fr, 0];
                    Grid[fr, 0] = null;
                    if (Grid[fr, tc + 1] != null) Grid[fr, tc + 1].HasMoved = true;
                }
            }

            Grid[tr, tc] = piece;
            Grid[fr, fc] = null;
            piece.HasMoved = true;

            // Pawn promotion
            if (piece.Type == PieceType.Pawn && (tr == 0 || tr == 7))
                Grid[tr, tc] = new Queen(piece.Color) { HasMoved = true };

            return notation;
        }

        private string BuildNotation(Piece piece, int fr, int fc, int tr, int tc, Piece captured)
        {
            string cols = "abcdefgh";
            string pieceLetter = piece.Type == PieceType.Pawn ? "" : piece.Type.ToString()[0].ToString();
            string capture = captured != null ? "x" : "";
            return $"{pieceLetter}{cols[fc]}{8 - fr}{capture}{cols[tc]}{8 - tr}";
        }
    }

    // ============================================================
    // BASIC AI CLASS
    // ============================================================
    public class ChessAI
    {
        private Random rng = new Random();

        // Piece values for scoring
        private int PieceValue(PieceType t)
        {
            switch (t)
            {
                case PieceType.Queen:  return 900;
                case PieceType.Rook:   return 500;
                case PieceType.Bishop: return 330;
                case PieceType.Knight: return 320;
                case PieceType.Pawn:   return 100;
                default: return 0;
            }
        }

        // Score the board from Black's perspective
        private int EvaluateBoard(Board board)
        {
            int score = 0;
            for (int r = 0; r < 8; r++)
                for (int c = 0; c < 8; c++)
                    if (board.Grid[r, c] != null)
                    {
                        int val = PieceValue(board.Grid[r, c].Type);
                        score += board.Grid[r, c].Color == PieceColor.Black ? val : -val;
                    }
            return score;
        }

        // Get best move for Black using 2-ply lookahead
        public (int fr, int fc, int tr, int tc) GetBestMove(Board board)
        {
            var legalMoves = board.GetAllLegalMoves(PieceColor.Black);
            if (legalMoves.Count == 0) return (-1, -1, -1, -1);

            int bestScore = int.MinValue;
            var bestMoves = new List<(int, int, int, int)>();

            foreach (var move in legalMoves)
            {
                var sim = new Board(board);
                sim.ExecuteMove(move.Item1, move.Item2, move.Item3, move.Item4);
                int score = EvaluateBoard(sim);

                // Look one ply deeper (White's best response)
                var whiteMoves = sim.GetAllLegalMoves(PieceColor.White);
                int worstWhite = int.MaxValue;
                foreach (var wm in whiteMoves)
                {
                    var sim2 = new Board(sim);
                    sim2.ExecuteMove(wm.Item1, wm.Item2, wm.Item3, wm.Item4);
                    int s2 = EvaluateBoard(sim2);
                    if (s2 < worstWhite) worstWhite = s2;
                }
                if (whiteMoves.Count > 0) score = worstWhite;

                if (score > bestScore)
                {
                    bestScore = score;
                    bestMoves.Clear();
                    bestMoves.Add(move);
                }
                else if (score == bestScore)
                {
                    bestMoves.Add(move);
                }
            }

            return bestMoves[rng.Next(bestMoves.Count)];
        }
    }

    // ============================================================
    // GAME CLASS
    // ============================================================
    public class Game
    {
        public Board Board { get; private set; }
        public PieceColor CurrentTurn { get; private set; } = PieceColor.White;
        public GameMode Mode { get; set; } = GameMode.TwoPlayer;
        public List<string> MoveHistory { get; private set; } = new List<string>();
        public bool IsGameOver { get; private set; } = false;
        public string GameOverMessage { get; private set; } = "";
        private int moveNumber = 1;

        public Game() { Board = new Board(); }
        public Game(GameMode mode) { Board = new Board(); Mode = mode; }

        public bool MakeMove(int fr, int fc, int tr, int tc)
        {
            if (IsGameOver) return false;
            if (Board.Grid[fr, fc] == null || Board.Grid[fr, fc].Color != CurrentTurn) return false;
            var legal = Board.GetAllLegalMoves(CurrentTurn);
            if (!legal.Contains((fr, fc, tr, tc))) return false;

            string notation = Board.ExecuteMove(fr, fc, tr, tc);

            // Record move
            if (CurrentTurn == PieceColor.White)
                MoveHistory.Add($"{moveNumber}. {notation}");
            else
            {
                if (MoveHistory.Count > 0)
                    MoveHistory[MoveHistory.Count - 1] += $"  {notation}";
                else
                    MoveHistory.Add($"{moveNumber}... {notation}");
                moveNumber++;
            }

            // Switch turn
            CurrentTurn = (CurrentTurn == PieceColor.White) ? PieceColor.Black : PieceColor.White;

            // Check game over conditions
            CheckGameOver();
            return true;
        }

        private void CheckGameOver()
        {
            var legalMoves = Board.GetAllLegalMoves(CurrentTurn);
            if (legalMoves.Count == 0)
            {
                IsGameOver = true;
                if (Board.IsInCheck(CurrentTurn))
                {
                    PieceColor winner = (CurrentTurn == PieceColor.White) ? PieceColor.Black : PieceColor.White;
                    GameOverMessage = $"Checkmate! {winner} wins! 🎉";
                }
                else
                {
                    GameOverMessage = "Stalemate! It's a draw! 🤝";
                }
            }
        }

        public bool IsCheck() => Board.IsInCheck(CurrentTurn);

        // Save game to file
        public void SaveGame(string path)
        {
            var sb = new StringBuilder();
            sb.AppendLine($"Mode:{Mode}");
            sb.AppendLine($"Turn:{CurrentTurn}");
            sb.AppendLine($"MoveNumber:{moveNumber}");
            sb.AppendLine("MoveHistory:");
            foreach (var m in MoveHistory) sb.AppendLine(m);
            sb.AppendLine("Board:");
            for (int r = 0; r < 8; r++)
                for (int c = 0; c < 8; c++)
                {
                    var p = Board.Grid[r, c];
                    if (p != null)
                        sb.AppendLine($"{r},{c},{p.Type},{p.Color},{p.HasMoved}");
                }
            File.WriteAllText(path, sb.ToString());
        }

        // Load game from file
        public static Game LoadGame(string path)
        {
            var lines = File.ReadAllLines(path);
            var game = new Game();
            game.Board = new Board();
            // Clear board
            for (int r = 0; r < 8; r++)
                for (int c = 0; c < 8; c++)
                    game.Board.Grid[r, c] = null;

            bool readingHistory = false, readingBoard = false;
            game.MoveHistory.Clear();

            foreach (var line in lines)
            {
                if (line.StartsWith("Mode:")) { game.Mode = (GameMode)Enum.Parse(typeof(GameMode), line.Substring(5)); readingHistory = false; readingBoard = false; }
                else if (line.StartsWith("Turn:")) { game.CurrentTurn = (PieceColor)Enum.Parse(typeof(PieceColor), line.Substring(5)); readingHistory = false; readingBoard = false; }
                else if (line.StartsWith("MoveNumber:")) { game.moveNumber = int.Parse(line.Substring(11)); readingHistory = false; readingBoard = false; }
                else if (line == "MoveHistory:") { readingHistory = true; readingBoard = false; }
                else if (line == "Board:") { readingBoard = true; readingHistory = false; }
                else if (readingHistory && !string.IsNullOrWhiteSpace(line)) game.MoveHistory.Add(line);
                else if (readingBoard && !string.IsNullOrWhiteSpace(line))
                {
                    var parts = line.Split(',');
                    int r = int.Parse(parts[0]), c = int.Parse(parts[1]);
                    var type = (PieceType)Enum.Parse(typeof(PieceType), parts[2]);
                    var color = (PieceColor)Enum.Parse(typeof(PieceColor), parts[3]);
                    bool hasMoved = bool.Parse(parts[4]);
                    Piece piece = CreatePiece(type, color);
                    piece.HasMoved = hasMoved;
                    game.Board.Grid[r, c] = piece;
                }
            }
            return game;
        }

        private static Piece CreatePiece(PieceType type, PieceColor color)
        {
            switch (type)
            {
                case PieceType.King:   return new King(color);
                case PieceType.Queen:  return new Queen(color);
                case PieceType.Rook:   return new Rook(color);
                case PieceType.Bishop: return new Bishop(color);
                case PieceType.Knight: return new Knight(color);
                default:               return new Pawn(color);
            }
        }
    }

    // ============================================================
    // WINDOWS FORMS UI
    // ============================================================
    public class ChessForm : Form
    {
        // UI Constants
        private const int CELL_SIZE  = 70;
        private const int BOARD_SIZE = 8 * CELL_SIZE;
        private const int PANEL_W    = 220;

        // Colors
        private readonly Color LightSquare   = Color.FromArgb(240, 217, 181);
        private readonly Color DarkSquare    = Color.FromArgb(181, 136, 99);
        private readonly Color SelectedColor = Color.FromArgb(100, 246, 246, 105);
        private readonly Color MoveHint      = Color.FromArgb(120, 106, 168, 79);
        private readonly Color CheckColor    = Color.FromArgb(150, 220, 50, 50);

        // Game state
        private Game game;
        private ChessAI ai = new ChessAI();
        private int selectedRow = -1, selectedCol = -1;
        private List<(int, int)> highlightedMoves = new List<(int, int)>();

        // UI Controls
        private Panel boardPanel;
        private ListBox moveListBox;
        private Label statusLabel;
        private Label turnLabel;
        private Button newGameBtn, saveBtn, loadBtn, undoBtn;
        private ComboBox modeCombo;

        public ChessForm()
        {
            InitializeUI();
            StartNewGame();
        }

        private void InitializeUI()
        {
            this.Text = "♟ Chess Game";
            this.Size = new Size(BOARD_SIZE + PANEL_W + 40, BOARD_SIZE + 60);
            this.FormBorderStyle = FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
            this.BackColor = Color.FromArgb(40, 40, 40);
            this.Font = new Font("Segoe UI", 9f);

            // Board panel
            boardPanel = new Panel
            {
                Location = new Point(10, 10),
                Size = new Size(BOARD_SIZE, BOARD_SIZE),
                BackColor = Color.Black
            };
            boardPanel.Paint += BoardPanel_Paint;
            boardPanel.MouseClick += BoardPanel_MouseClick;
            this.Controls.Add(boardPanel);

            int px = BOARD_SIZE + 20;

            // Mode selector
            var modeLabel = new Label { Text = "Game Mode:", ForeColor = Color.LightGray, Location = new Point(px, 10), Size = new Size(100, 20) };
            this.Controls.Add(modeLabel);

            modeCombo = new ComboBox
            {
                Location = new Point(px, 30),
                Size = new Size(190, 25),
                DropDownStyle = ComboBoxStyle.DropDownList,
                BackColor = Color.FromArgb(60, 60, 60),
                ForeColor = Color.White
            };
            modeCombo.Items.Add("Two Players");
            modeCombo.Items.Add("vs AI (you = White)");
            modeCombo.SelectedIndex = 0;
            this.Controls.Add(modeCombo);

            // New game button
            newGameBtn = MakeButton("New Game", px, 65, Color.FromArgb(46, 125, 50));
            newGameBtn.Click += (s, e) => StartNewGame();
            this.Controls.Add(newGameBtn);

            // Save button
            saveBtn = MakeButton("Save Game", px, 105, Color.FromArgb(21, 101, 192));
            saveBtn.Click += SaveGame;
            this.Controls.Add(saveBtn);

            // Load button
            loadBtn = MakeButton("Load Game", px, 145, Color.FromArgb(21, 101, 192));
            loadBtn.Click += LoadGame;
            this.Controls.Add(loadBtn);

            // Turn label
            turnLabel = new Label
            {
                Text = "⬜ White's Turn",
                ForeColor = Color.White,
                Font = new Font("Segoe UI", 11f, FontStyle.Bold),
                Location = new Point(px, 195),
                Size = new Size(200, 30),
                TextAlign = ContentAlignment.MiddleCenter
            };
            this.Controls.Add(turnLabel);

            // Status label
            statusLabel = new Label
            {
                Text = "",
                ForeColor = Color.FromArgb(255, 100, 100),
                Font = new Font("Segoe UI", 10f, FontStyle.Bold),
                Location = new Point(px, 230),
                Size = new Size(200, 30),
                TextAlign = ContentAlignment.MiddleCenter
            };
            this.Controls.Add(statusLabel);

            // Move history
            var histLabel = new Label { Text = "Move History:", ForeColor = Color.LightGray, Location = new Point(px, 270), Size = new Size(150, 20) };
            this.Controls.Add(histLabel);

            moveListBox = new ListBox
            {
                Location = new Point(px, 295),
                Size = new Size(200, BOARD_SIZE - 300),
                BackColor = Color.FromArgb(30, 30, 30),
                ForeColor = Color.LightGreen,
                Font = new Font("Courier New", 9f),
                BorderStyle = BorderStyle.FixedSingle
            };
            this.Controls.Add(moveListBox);
        }

        private Button MakeButton(string text, int x, int y, Color bg)
        {
            return new Button
            {
                Text = text,
                Location = new Point(x, y),
                Size = new Size(190, 32),
                BackColor = bg,
                ForeColor = Color.White,
                FlatStyle = FlatStyle.Flat,
                Font = new Font("Segoe UI", 9f, FontStyle.Bold),
                Cursor = Cursors.Hand
            };
        }

        private void StartNewGame()
        {
            GameMode mode = modeCombo.SelectedIndex == 1 ? GameMode.VsAI : GameMode.TwoPlayer;
            game = new Game(mode);
            selectedRow = selectedCol = -1;
            highlightedMoves.Clear();
            UpdateUI();
            boardPanel.Invalidate();
        }

        private void UpdateUI()
        {
            if (game.IsGameOver)
            {
                statusLabel.Text = game.GameOverMessage;
                turnLabel.Text = "Game Over";
            }
            else
            {
                string check = game.IsCheck() ? " ⚠ CHECK!" : "";
                turnLabel.Text = game.CurrentTurn == PieceColor.White ? "⬜ White's Turn" : "⬛ Black's Turn";
                statusLabel.Text = check;
                statusLabel.ForeColor = check != "" ? Color.FromArgb(255, 100, 100) : Color.Transparent;
            }

            moveListBox.Items.Clear();
            foreach (var m in game.MoveHistory)
                moveListBox.Items.Add(m);
            if (moveListBox.Items.Count > 0)
                moveListBox.TopIndex = moveListBox.Items.Count - 1;
        }

        // ---- Drawing ----
        private void BoardPanel_Paint(object sender, PaintEventArgs e)
        {
            var g = e.Graphics;
            g.TextRenderingHint = System.Drawing.Text.TextRenderingHint.AntiAlias;

            var kingPos = game.IsCheck() ? game.Board.FindKing(game.CurrentTurn) : ((-1, -1));

            for (int r = 0; r < 8; r++)
            {
                for (int c = 0; c < 8; c++)
                {
                    Rectangle rect = new Rectangle(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);

                    // Base color
                    Color sq = (r + c) % 2 == 0 ? LightSquare : DarkSquare;
                    g.FillRectangle(new SolidBrush(sq), rect);

                    // Check highlight
                    if (r == kingPos.Item1 && c == kingPos.Item2)
                        g.FillRectangle(new SolidBrush(CheckColor), rect);

                    // Selected highlight
                    if (r == selectedRow && c == selectedCol)
                        g.FillRectangle(new SolidBrush(SelectedColor), rect);

                    // Move hints
                    if (highlightedMoves.Contains((r, c)))
                    {
                        if (game.Board.Grid[r, c] != null)
                        {
                            // Capture ring
                            using (var pen = new Pen(MoveHint, 4))
                                g.DrawEllipse(pen, rect.X + 4, rect.Y + 4, CELL_SIZE - 8, CELL_SIZE - 8);
                        }
                        else
                        {
                            // Move dot
                            int dot = CELL_SIZE / 3;
                            g.FillEllipse(new SolidBrush(MoveHint),
                                rect.X + (CELL_SIZE - dot) / 2, rect.Y + (CELL_SIZE - dot) / 2, dot, dot);
                        }
                    }

                    // Draw piece
                    var piece = game.Board.Grid[r, c];
                    if (piece != null)
                    {
                        string sym = GetPieceSymbol(piece);
                        using (var font = new Font("Segoe UI Symbol", 36, FontStyle.Regular, GraphicsUnit.Pixel))
                        {
                            var sf = new StringFormat { Alignment = StringAlignment.Center, LineAlignment = StringAlignment.Center };
                            // Shadow
                            g.DrawString(sym, font, Brushes.Black, new RectangleF(rect.X + 2, rect.Y + 2, CELL_SIZE, CELL_SIZE), sf);
                            // Piece
                            Brush brush = piece.Color == PieceColor.White ? Brushes.White : Brushes.Black;
                            g.DrawString(sym, font, brush, rect, sf);
                        }
                    }
                }
            }

            // Draw coordinates
            using (var font = new Font("Segoe UI", 7.5f, FontStyle.Bold))
            {
                string cols = "abcdefgh";
                for (int c = 0; c < 8; c++)
                {
                    Color fg = c % 2 == 0 ? DarkSquare : LightSquare;
                    g.DrawString(cols[c].ToString(), font, new SolidBrush(fg),
                        c * CELL_SIZE + CELL_SIZE - 11, BOARD_SIZE - 14);
                }
                for (int r = 0; r < 8; r++)
                {
                    Color fg = r % 2 == 0 ? LightSquare : DarkSquare;
                    g.DrawString((8 - r).ToString(), font, new SolidBrush(fg),
                        2, r * CELL_SIZE + 2);
                }
            }
        }

        private string GetPieceSymbol(Piece piece)
        {
            if (piece.Color == PieceColor.White)
            {
                switch (piece.Type)
                {
                    case PieceType.King:   return "♔";
                    case PieceType.Queen:  return "♕";
                    case PieceType.Rook:   return "♖";
                    case PieceType.Bishop: return "♗";
                    case PieceType.Knight: return "♘";
                    default:               return "♙";
                }
            }
            else
            {
                switch (piece.Type)
                {
                    case PieceType.King:   return "♚";
                    case PieceType.Queen:  return "♛";
                    case PieceType.Rook:   return "♜";
                    case PieceType.Bishop: return "♝";
                    case PieceType.Knight: return "♞";
                    default:               return "♟";
                }
            }
        }

        // ---- Input ----
        private void BoardPanel_MouseClick(object sender, MouseEventArgs e)
        {
            if (game.IsGameOver) return;
            if (game.Mode == GameMode.VsAI && game.CurrentTurn == PieceColor.Black) return;

            int col = e.X / CELL_SIZE;
            int row = e.Y / CELL_SIZE;
            if (col < 0 || col > 7 || row < 0 || row > 7) return;

            var piece = game.Board.Grid[row, col];

            if (selectedRow == -1)
            {
                // Select a piece
                if (piece != null && piece.Color == game.CurrentTurn)
                {
                    selectedRow = row; selectedCol = col;
                    var rawMoves = piece.GetValidMoves(game.Board, row, col);
                    highlightedMoves = rawMoves
                        .Where(m => !game.Board.MoveLeavesKingInCheck(game.CurrentTurn, row, col, m.row, m.col))
                        .Select(m => (m.row, m.col))
                        .ToList();
                }
            }
            else
            {
                if (highlightedMoves.Contains((row, col)))
                {
                    // Make the move
                    game.MakeMove(selectedRow, selectedCol, row, col);
                    selectedRow = selectedCol = -1;
                    highlightedMoves.Clear();
                    UpdateUI();
                    boardPanel.Invalidate();

                    // AI move
                    if (!game.IsGameOver && game.Mode == GameMode.VsAI && game.CurrentTurn == PieceColor.Black)
                    {
                        var aiMove = ai.GetBestMove(game.Board);
                        if (aiMove.fr >= 0)
                        {
                            game.MakeMove(aiMove.fr, aiMove.fc, aiMove.tr, aiMove.tc);
                            UpdateUI();
                            boardPanel.Invalidate();
                        }
                    }

                    if (game.IsGameOver)
                        MessageBox.Show(game.GameOverMessage, "Game Over", MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
                else if (piece != null && piece.Color == game.CurrentTurn)
                {
                    // Re-select another piece
                    selectedRow = row; selectedCol = col;
                    var rawMoves = piece.GetValidMoves(game.Board, row, col);
                    highlightedMoves = rawMoves
                        .Where(m => !game.Board.MoveLeavesKingInCheck(game.CurrentTurn, row, col, m.row, m.col))
                        .Select(m => (m.row, m.col))
                        .ToList();
                }
                else
                {
                    selectedRow = selectedCol = -1;
                    highlightedMoves.Clear();
                }
            }

            boardPanel.Invalidate();
        }

        private void SaveGame(object sender, EventArgs e)
        {
            using (var dlg = new SaveFileDialog { Filter = "Chess Save|*.chess", Title = "Save Game" })
                if (dlg.ShowDialog() == DialogResult.OK)
                {
                    game.SaveGame(dlg.FileName);
                    MessageBox.Show("Game saved!", "Saved", MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
        }

        private void LoadGame(object sender, EventArgs e)
        {
            using (var dlg = new OpenFileDialog { Filter = "Chess Save|*.chess", Title = "Load Game" })
                if (dlg.ShowDialog() == DialogResult.OK)
                {
                    game = Game.LoadGame(dlg.FileName);
                    selectedRow = selectedCol = -1;
                    highlightedMoves.Clear();
                    UpdateUI();
                    boardPanel.Invalidate();
                    modeCombo.SelectedIndex = game.Mode == GameMode.VsAI ? 1 : 0;
                }
        }
    }

    // ============================================================
    // ENTRY POINT
    // ============================================================
    static class Program
    {
        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new ChessForm());
        }
    }
}
