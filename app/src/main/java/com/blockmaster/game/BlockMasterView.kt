package com.blockmaster.game

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.LinearGradient
import android.graphics.Paint
import android.graphics.RectF
import android.graphics.Shader
import android.view.MotionEvent
import android.view.View
import kotlin.math.max
import kotlin.math.min
import kotlin.random.Random

class BlockMasterView(context: Context) : View(context) {
    private val prefs = context.getSharedPreferences("block_master", Context.MODE_PRIVATE)
    private val board = Array(8) { IntArray(8) }
    private val palette = intArrayOf(Color.rgb(255,181,46), Color.rgb(48,202,255), Color.rgb(255,83,126), Color.rgb(116,235,133), Color.rgb(163,112,255), Color.rgb(255,126,55))
    private val shapes = listOf(
        listOf(0 to 0), listOf(0 to 0, 1 to 0), listOf(0 to 0, 0 to 1),
        listOf(0 to 0, 1 to 0, 2 to 0), listOf(0 to 0, 0 to 1, 0 to 2),
        listOf(0 to 0, 1 to 0, 0 to 1, 1 to 1), listOf(0 to 0, 1 to 0, 2 to 0, 1 to 1),
        listOf(0 to 0, 0 to 1, 1 to 1, 1 to 2), listOf(1 to 0, 0 to 1, 1 to 1, 2 to 1),
        listOf(0 to 0, 1 to 0, 2 to 0, 0 to 1, 1 to 1), listOf(0 to 0, 0 to 1, 0 to 2, 1 to 2, 2 to 2)
    )
    private data class Piece(val cells: List<Pair<Int,Int>>, val color: Int)
    private var pieces = MutableList(3) { makePiece() }
    private var score = 0
    private var best = prefs.getInt("best", 0)
    private var selected = -1
    private var dragX = 0f
    private var dragY = 0f
    private var grabX = 0
    private var grabY = 0
    private var gameOver = false
    private val p = Paint(Paint.ANTI_ALIAS_FLAG)
    private val bg = Color.rgb(4, 13, 46)
    private val panel = Color.rgb(13, 30, 78)
    private val cell = Color.rgb(24, 47, 103)
    private val boardRect = RectF()
    private var cellSize = 0f
    private var boardLeft = 0f
    private var boardTop = 0f
    private var trayTop = 0f

    private fun makePiece(): Piece = Piece(shapes[Random.nextInt(shapes.size)], palette[Random.nextInt(palette.size)])
    private fun text(c: Canvas, value: String, x: Float, y: Float, size: Float, color: Int, bold: Boolean = true) {
        p.shader = null; p.color = color; p.textSize = size; p.typeface = if (bold) android.graphics.Typeface.create("sans-serif", 1) else android.graphics.Typeface.create("sans-serif", 0)
        p.textAlign = Paint.Align.CENTER; c.drawText(value, x, y, p)
    }
    private fun rounded(c: Canvas, r: RectF, radius: Float, color: Int) {
        p.shader = null; p.color = color; c.drawRoundRect(r, radius, radius, p)
    }
    private fun block(c: Canvas, x: Float, y: Float, size: Float, color: Int) {
        val gap = size * .075f
        val r = RectF(x + gap, y + gap, x + size - gap, y + size - gap)
        p.shader = LinearGradient(r.left, r.top, r.left, r.bottom, lighten(color), color, Shader.TileMode.CLAMP)
        c.drawRoundRect(r, size * .17f, size * .17f, p)
        p.shader = null
        p.color = Color.argb(90,255,255,255)
        c.drawRoundRect(r.left + size*.12f, r.top + size*.10f, r.right-size*.12f, r.top+size*.20f, size*.06f, size*.06f, p)
    }
    private fun lighten(color: Int): Int = Color.rgb(min(255, Color.red(color)+45), min(255, Color.green(color)+45), min(255, Color.blue(color)+45))
    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        canvas.drawColor(bg)
        val w = width.toFloat(); val h = height.toFloat()
        text(canvas, "BLOCK MASTER", w/2, h*.075f, w*.075f, Color.WHITE)
        text(canvas, "PUZZLE", w/2, h*.105f, w*.027f, Color.rgb(255,195,68))
        val cardW = w*.39f; val cardH = h*.075f
        rounded(canvas, RectF(w*.06f,h*.13f,w*.06f+cardW,h*.13f+cardH), 18f, panel)
        rounded(canvas, RectF(w*.55f,h*.13f,w*.55f+cardW,h*.13f+cardH), 18f, panel)
        text(canvas,"SCORE",w*.255f,h*.155f,h*.018f,Color.LTGRAY)
        text(canvas,score.toString(),w*.255f,h*.19f,h*.032f,Color.WHITE)
        text(canvas,"BEST",w*.745f,h*.155f,h*.018f,Color.LTGRAY)
        text(canvas,best.toString(),w*.745f,h*.19f,h*.032f,Color.WHITE)

        cellSize = min(w*.105f, h*.061f)
        val boardSize = cellSize*8
        boardLeft = (w-boardSize)/2f
        boardTop = h*.265f
        boardRect.set(boardLeft-8,boardTop-8,boardLeft+boardSize+8,boardTop+boardSize+8)
        rounded(canvas,boardRect,20f,panel)
        for (r in 0..7) for (col in 0..7) {
            val x=boardLeft+col*cellSize; val y=boardTop+r*cellSize
            rounded(canvas,RectF(x+2,y+2,x+cellSize-2,y+cellSize-2),cellSize*.14f,cell)
            if(board[r][col]!=0) block(canvas,x,y,cellSize,board[r][col])
        }
        text(canvas,"YOUR BLOCKS",w/2,h*.79f,h*.024f,Color.WHITE)
        trayTop=h*.815f
        val zoneW=w/3f
        pieces.forEachIndexed { i, piece ->
            val maxX=piece.cells.maxOf { it.first }+1
            val maxY=piece.cells.maxOf { it.second }+1
            val unit=min(w*.075f, h*.043f)
            val originX=zoneW*i+zoneW/2f-maxX*unit/2f
            val originY=trayTop+(h*.13f-maxY*unit)/2f
            if(i!=selected) piece.cells.forEach { (cx,cy)->block(canvas,originX+cx*unit,originY+cy*unit,unit,piece.color) }
        }
        if(selected>=0 && !gameOver) {
            val piece=pieces[selected]
            val left=dragX-(grabX+.5f)*cellSize
            val top=dragY-(grabY+.5f)*cellSize
            piece.cells.forEach { (cx,cy)->block(canvas,left+cx*cellSize,top+cy*cellSize,cellSize,piece.color) }
        }
        if(gameOver) {
            rounded(canvas,RectF(w*.1f,h*.34f,w*.9f,h*.66f),24f,Color.rgb(12,27,70))
            text(canvas,"GAME OVER",w/2,h*.43f,h*.045f,Color.WHITE)
            text(canvas,"SCORE  $score",w/2,h*.49f,h*.027f,Color.WHITE)
            rounded(canvas,RectF(w*.27f,h*.535f,w*.73f,h*.61f),18f,Color.rgb(255,181,46))
            text(canvas,"TAP TO RETRY",w/2,h*.58f,h*.023f,bg)
        }
    }
    override fun onTouchEvent(event: MotionEvent): Boolean {
        val x=event.x; val y=event.y
        when(event.actionMasked) {
            MotionEvent.ACTION_DOWN -> {
                if(gameOver) { reset(); return true }
                if(y>=trayTop && y<height*.97f && selected<0) {
                    val idx=(x/(width/3f)).toInt().coerceIn(0,2)
                    if(pieces[idx].cells.isNotEmpty()) {
                        selected=idx; dragX=x; dragY=y
                        val unit=min(width*.075f,height*.043f)
                        val maxX=pieces[idx].cells.maxOf { it.first }+1
                        val maxY=pieces[idx].cells.maxOf { it.second }+1
                        val ox=(width/3f)*idx+width/6f-maxX*unit/2f
                        val oy=trayTop+(height*.13f-maxY*unit)/2f
                        grabX=((x-ox)/unit).toInt().coerceIn(0,maxX-1)
                        grabY=((y-oy)/unit).toInt().coerceIn(0,maxY-1)
                        invalidate()
                    }
                }
                return true
            }
            MotionEvent.ACTION_MOVE -> if(selected>=0) { dragX=x; dragY=y; invalidate(); return true }
            MotionEvent.ACTION_UP -> if(selected>=0) {
                val piece=pieces[selected]
                val col=((x-boardLeft)/cellSize).toInt()-grabX
                val row=((y-boardTop)/cellSize).toInt()-grabY
                if(canPlace(piece,row,col)) place(piece,row,col)
                selected=-1; invalidate(); return true
            }
        }
        return true
    }
    private fun canPlace(piece:Piece,row:Int,col:Int):Boolean = piece.cells.all { (dx,dy)->row+dy in 0..7 && col+dx in 0..7 && board[row+dy][col+dx]==0 }
    private fun place(piece:Piece,row:Int,col:Int) {
        piece.cells.forEach { (dx,dy)->board[row+dy][col+dx]=piece.color }
        score+=piece.cells.size
        val fullRows=(0..7).filter { r->(0..7).all { board[r][it]!=0 } }
        val fullCols=(0..7).filter { c->(0..7).all { board[it][c]!=0 } }
        val clear=mutableSetOf<Pair<Int,Int>>()
        fullRows.forEach { r->(0..7).forEach { clear.add(r to it) } }
        fullCols.forEach { c->(0..7).forEach { clear.add(it to c) } }
        clear.forEach { (r,c)->board[r][c]=0 }
        score+=clear.size*2
        if(score>best) { best=score; prefs.edit().putInt("best",best).apply() }
        pieces[selected]=Piece(emptyList(),piece.color)
        if(pieces.all { it.cells.isEmpty() }) pieces=MutableList(3){makePiece()}
        if(pieces.filter { it.cells.isNotEmpty() }.all { pce->!hasMove(pce) }) gameOver=true
    }
    private fun hasMove(piece:Piece):Boolean = (0..7).any { r->(0..7).any { c->canPlace(piece,r,c) } }
    private fun reset() { for(r in 0..7) board[r].fill(0); score=0; pieces=MutableList(3){makePiece()}; gameOver=false; selected=-1; invalidate() }
}
